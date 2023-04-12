import path from 'path'
import fs from 'fs'

import glob from 'glob'
import { User } from '@supabase/supabase-js'

import { supabaseService } from '../../../utils/supabase'
import { getExifData } from '../../../utils/exif'
import { generateStringId, getExtension } from '../../../utils'
import { IMPORT_PATH, MEDIA_PATH } from '../../../constants'
import { DatabaseInsert, DatabaseUpdate } from '../../../../../types/utils'

const IMAGES_EXTENSIONS = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'nef']
const VIDEOS_EXTENSIONS = ['avi', 'mov', 'mp4', 'mkv']
const IGNORE_LIST = ['DS_Store', '.*']
const DEFAULT_USER_EMAIL = 'julien.rougeron@gmail.com'

const syncMedia = async ({
  filePath,
  user,
}: {
  filePath: string
  user: User
}) => {
  const metadata = getExifData(filePath)

  try {
    await supabaseService
      .from('Media')
      .upsert(metadata, { onConflict: 'path' })
      .select()

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

  const files = glob.sync(MEDIA_PATH + '/**/*.*')

  console.log(`⚙️ Syncing ${files.length} file${files.length ? 's' : ''}`)

  let successCount = 0
  let failCount = 0

  for (const filePath of files) {
    const rootFolder = filePath.split('/').slice(-2, -1)
    const userEmail = rootFolder.includes('@') ? rootFolder : DEFAULT_USER_EMAIL

    const user = users.find(({ email }) => email === userEmail)

    if (!user) return

    try {
      await syncMedia({ filePath, user })

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
