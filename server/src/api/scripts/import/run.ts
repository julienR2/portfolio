import { Media, User } from '@prisma/client'
import fs from 'fs'
import glob from 'glob'
import path from 'path'

import { IMPORT_PATH, MEDIA_PATH } from '../../../constants'
import { getExtension } from '../../../utils'
import { getMetadata } from '../../../utils/exif'
import { createOrUpdateMedia } from '../../media/services'
import { findUserByEmail } from '../../users/services'

const IMAGES_EXTENSIONS = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'nef']
const VIDEOS_EXTENSIONS = ['avi', 'mov', 'mp4', 'mkv']
const IGNORE_LIST = ['DS_Store', '.*']
const DEFAULT_USER_EMAIL = 'julien.rougeron@gmail.com'

const importFile = async ({
  filePath,
  userId,
}: {
  filePath: string
  userId: string
}) => {
  const extension = getExtension(filePath)

  if (IGNORE_LIST.includes(extension)) return

  const isImage = IMAGES_EXTENSIONS.includes(extension)
  const isVideo = VIDEOS_EXTENSIONS.includes(extension)

  if (!isImage && !isVideo) {
    console.log('Media Import - ⏳ Importing file')
    return
  }

  const metadata = getMetadata(filePath)

  console.log(`Media Import - ⏳ Importing ${isImage ? 'image' : 'video'}`)
  console.log('metadata.creationDate', metadata.creationDate)
  const [year, month, day] = metadata.creationDate.split(' ')[0].split(':')

  const newName = `${year}-${month}-${day} - ${metadata.name}`

  const destPath = path.join(
    MEDIA_PATH,
    year,
    month,
    `${newName}.${metadata.extension}`,
  )

  fs.mkdirSync(destPath, { recursive: true })
  fs.renameSync(filePath, destPath)

  const newMetadata: Omit<Media, 'id'> = {
    ...metadata,
    name: newName,
    path: destPath,
    ownerId: userId,
  }

  await createOrUpdateMedia(newMetadata)
}

const run = async () => {
  const users: { [email: string]: User } = {}
  const files = glob
    .sync(IMPORT_PATH + '/**/*')
    .filter((file) => !fs.lstatSync(file).isDirectory())

  for (const filePath of files) {
    const rootFolder = filePath.replace(IMPORT_PATH, '').split('/')[1]
    const userEmail = rootFolder.includes('@') ? rootFolder : DEFAULT_USER_EMAIL

    const user = users[userEmail] || (await findUserByEmail(userEmail))
    users[userEmail] = user

    await importFile({ filePath, userId: user.id })
  }
}

export default run
