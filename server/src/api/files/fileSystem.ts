import { Request } from 'express'
import fs from 'fs'
import path from 'path'

import { File } from '../../../../types'

import { FILES_PATH } from '../../constants'

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
      path: filePath.replace(FILES_PATH, ''),
      url: new URL(`${currentUrl.replace(/\/$/, '')}/${name}`),
      isDirectory: fs.lstatSync(path.join(filePath, '/', name)).isDirectory(),
    }))

  return list
}
