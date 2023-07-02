import fs from 'fs'
import path from 'path'

import { STORAGE_PATH } from '../../../helpers/constants'

export type File = {
  id: string
  name: string
  path: string
  isDirectory?: boolean
}

export const listDirectory = (
  filePath: string,
  currentUrl: string,
): File[] | null => {
  const list: File[] = fs
    .readdirSync(filePath)
    .filter((name) => name[0] !== '.')
    .map((name) => ({
      id: name,
      name,
      path: filePath.replace(STORAGE_PATH, ''),
      url: new URL(`${currentUrl.replace(/\/$/, '')}/${name}`),
      isDirectory: fs.lstatSync(path.join(filePath, '/', name)).isDirectory(),
    }))

  return list
}
