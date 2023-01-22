import { Media, User } from '@prisma/client'
import fs from 'fs'
import glob from 'glob'
import path from 'path'

import { IMPORT_PATH, MEDIA_PATH } from '../../../constants'
import { generateStringId, getExtension } from '../../../utils'
import { getMetadata } from '../../../utils/exif'
import { createMedia } from '../../storage/services'
import { findUserByEmail } from '../../users/services'

const IMAGES_EXTENSIONS = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'nef']
const VIDEOS_EXTENSIONS = ['avi', 'mov', 'mp4', 'mkv']
const IGNORE_LIST = ['DS_Store', '.*']
const DEFAULT_USER_EMAIL = 'julien.rougeron@gmail.com'

const importFile = async ({
  filePath,
  userId,
  type,
}: {
  filePath: string
  userId: string
  type: 'media' | 'files' | 'all'
}) => {
  const extension = getExtension(filePath)

  if (IGNORE_LIST.includes(extension)) return

  const isImage = IMAGES_EXTENSIONS.includes(extension)
  const isVideo = VIDEOS_EXTENSIONS.includes(extension)

  if (!isImage && !isVideo && (type === 'all' || type === 'files')) {
    console.log('Media Import - ⏳ Importing file')
    return
  }

  if (type !== 'all' && type !== 'media') return

  const metadata = getMetadata(filePath)

  const [year, month, day] = metadata.creationTime.split(' ')[0].split(':')
  const id = generateStringId(metadata.filename + userId || '')
  const newName = `${year}${month}${day}_${id}`
  const destPath = path.join(MEDIA_PATH, year, month)
  const destFile = path.join(destPath, `${newName}.${metadata.extension}`)

  const newMetadata: Media = {
    ...metadata,
    id,
    filename: newName,
    path: destFile,
    ownerId: userId,
  }
  const parentFolder = filePath.replace(IMPORT_PATH, '').split('/').slice(-2)[0]
  const tags =
    parentFolder && !parentFolder.includes('@') ? [parentFolder] : undefined

  try {
    await createMedia(newMetadata, tags)

    fs.mkdirSync(destPath, { recursive: true })
    fs.renameSync(filePath, destFile)
  } catch (error) {
    console.error(
      `❌ Error proccessing ${filePath}`,
      metadata,
      newMetadata,
      error,
    )
  }
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

    await importFile({ filePath, userId: user.id, type: 'all' })
  }
}

export default run
