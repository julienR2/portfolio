import { Request } from 'express'
import fs from 'fs'
import path from 'path'

import { File } from '../../../types'

import { MEDIA_PATH } from '../constants'

export const listDirectory = (req: Request): File[] | null => {
  const currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  const rawQueryPath = req.path
  const queryPath = path.join(MEDIA_PATH, rawQueryPath)

  if (!fs.lstatSync(queryPath).isDirectory()) return null

  const list: File[] = fs
    .readdirSync(queryPath)
    .filter((name) => name[0] !== '.')
    .map((name) => ({
      id: name,
      name,
      path: path.join(rawQueryPath, name),
      url: new URL(`${currentUrl.replace(/\/$/, '')}/${name}`),
      isDirectory: fs.lstatSync(path.join(queryPath, '/', name)).isDirectory(),
    }))

  return list
}
