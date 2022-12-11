import glob from 'glob'
import path from 'path'

import { IMPORT_PATH, MEDIA_PATH } from '../../../constants'
import { getExtension } from '../../../utils'
import { getMetadata } from '../../../utils/exif'

const IMAGES_EXTENSIONS = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'nef']
const VIDEOS_EXTENSIONS = ['avi', 'mov', 'mp4', 'mkv']
const IGNORE_LIST = ['DS_Store', '.*']

const importFile = async (filePath: string) => {
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
  const [year, month, day] = metadata.creationDate.split('T')[0].split('-')

  const newName = `${year}-${month}-${day} - ${metadata.name}`

  const destPath = path.join(MEDIA_PATH, year, month)
  // fs.mkdirSync(destPath, { recursive: true })
  // fs.renameSync(
  //   filePath,
  //   path.join(destPath, `${newName}.${metadata.extension}`),
  // )

  const newMetadata = {
    ...metadata,
    name: newName,
    path: destPath,
  }
  console.log('new metadata', newMetadata)
}

const run = async () => {
  const files = glob.sync(IMPORT_PATH + '/**/*')

  for (const file of files) {
    await importFile(file)
  }
}

export default run
