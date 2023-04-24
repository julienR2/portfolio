import fs from 'fs'

import glob from 'glob'
import { User } from '@supabase/supabase-js'

import { supabaseService } from '../../../utils/supabase'
import { getExifData } from '../../../utils/exif'
import { MEDIA_PATH } from '../../../constants'

const syncMedia = async ({
  filePath,
  user,
}: {
  filePath: string
  user: User
}) => {
  const metadata = getExifData(filePath)
  const media = {
    ...metadata,
    owner: user.id,
    path: metadata.path
      .replace(MEDIA_PATH, '')
      .replace(user.id || '', '')
      .replace(/^\//, ''),
  }

  try {
    const { error } = await supabaseService
      .from('Media')
      .upsert(media, { onConflict: 'path' })
      .select()

    if (error) {
      throw error
    }
  } catch (error) {
    console.error(`❌ Error proccessing ${filePath}`, metadata, error)

    throw error
  }
}

const run = async () => {
  const timeStart = Date.now()

  const {
    data: { users },
  } = await supabaseService.auth.admin.listUsers()

  const files = glob
    .sync(MEDIA_PATH + '/**/*.*')
    .filter((file) => !fs.lstatSync(file).isDirectory())

  console.log(`⚙️ Syncing ${files.length} file${files.length ? 's' : ''}`)

  let successCount = 0
  let failCount = 0

  for (const filePath of files) {
    const userID = filePath.replace(MEDIA_PATH, '').split('/')[1]

    const user = users.find(({ id }) => id === userID)

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
    `\n🏁 Import done in ${Math.round(
      (Date.now() - timeStart) / 1000,
    )}s, with: ${successCount} success ✅, and ${failCount} fail ❌`,
  )
}

export default run
