import path from 'path'
import fs from 'fs'

import glob from 'glob'
import { User } from '@supabase/supabase-js'

import { DatabaseInsert } from '../../../../../types/utils'
import { supabaseService } from '../../../utils/supabase'
import { getExifData } from '../../../utils/exif'
import { generateStringId, getExtension } from '../../../utils'
import { IMPORT_PATH, MEDIA_PATH } from '../../../constants'

const IMAGES_EXTENSIONS = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'nef']
const VIDEOS_EXTENSIONS = ['avi', 'mov', 'mp4', 'mkv']
const IGNORE_LIST = ['DS_Store', '.*']
const DEFAULT_USER_EMAIL = 'julien.rougeron@gmail.com'

const getMetadata = (user: User, filePath: string): DatabaseInsert<'Media'> => {
  const metadata = getExifData(filePath)

  const [year, month, day] = metadata.creationTime.split('T')[0].split('-')

  const id = generateStringId(
    metadata.filename +
      metadata.creationTime +
      metadata.latitude +
      metadata.longitude +
      metadata.path,
  )
  const newName = `${year}${month}${day}_${id}`
  const destPath = path.join(MEDIA_PATH, user.email ?? '', year, month)
  const destFile = path.join(destPath, `${newName}.${metadata.extension}`)

  return {
    ...metadata,
    id,
    filename: newName,
    path: destFile,
    owner: user.id,
  }
}

const importFile = async ({
  filePath,
  user,
  type,
}: {
  filePath: string
  user: User
  type: 'media' | 'files' | 'all'
}) => {
  const extension = getExtension(filePath)

  if (IGNORE_LIST.includes(extension)) return

  const isImage = IMAGES_EXTENSIONS.includes(extension)
  const isVideo = VIDEOS_EXTENSIONS.includes(extension)

  if (!isImage && !isVideo && (type === 'all' || type === 'files')) {
    return
  }

  if (type !== 'all' && type !== 'media') return

  const metadata = getMetadata(user, filePath)

  try {
    await supabaseService
      .from('Media')
      .insert<DatabaseInsert<'Media'>>(metadata)

    const destFolder = metadata.path.split('/').slice(0, -1).join('/')

    try {
      fs.mkdirSync(destFolder, { recursive: true })
      fs.renameSync(filePath, metadata.path)
    } catch (error) {
      await supabaseService.from('Media').delete().eq('id', metadata.id)

      throw error
    }
  } catch (error) {
    console.error(`❌ Error proccessing ${filePath}`, metadata, error)

    throw error
  }
}

const run = async () => {
  const {
    data: { users },
  } = await supabaseService.auth.admin.listUsers()

  const files = glob
    .sync(IMPORT_PATH + '/**/*')
    .filter((file) => !fs.lstatSync(file).isDirectory())

  console.log(`⚙️ Importing ${files.length} file${files.length ? 's' : ''}`)

  let successCount = 0
  let failCount = 0

  for (const filePath of files) {
    const rootFolder = filePath.replace(IMPORT_PATH, '').split('/')[1]
    const userEmail = rootFolder.includes('@') ? rootFolder : DEFAULT_USER_EMAIL

    const user = users.find(({ email }) => email === userEmail)

    if (!user) return

    try {
      await importFile({ filePath, user, type: 'media' })

      successCount += 1
    } catch (error) {
      failCount += 1
    }

    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    process.stdout.write(
      `Progress: ${Math.round(
        ((successCount + failCount) * 100) / files.length,
      )}% (${successCount + failCount} / ${files.length})`,
    )
  }

  console.log(
    `\n🏁 Import done with: ${successCount} success ✅, and ${failCount} fail ❌`,
  )
}

export default run
