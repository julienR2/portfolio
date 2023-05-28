import path from 'path'
import fs from 'fs'

import mime from 'mime-types'
import { NextApiRequest, NextApiResponse } from 'next'

import { STORAGE_PATH } from '../../../utils/constants'

import { listDirectory } from './fileSystem'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const slug = (req.query.slug as string[])?.join('/') ?? ''
  const filePath = path.join(STORAGE_PATH, slug)

  if (!fs.existsSync(filePath)) {
    return res.status(404)
  }

  if (fs.lstatSync(filePath).isDirectory()) {
    const protocol = req.headers.referer?.split('://')[0]

    const info = listDirectory(
      filePath,
      protocol + '://' + req.headers.host + req.url,
    )

    return res.json(info)
  }

  const range = req.headers.range
  if (!range) {
    const mediaBuffer = fs.readFileSync(filePath)

    return res.send(mediaBuffer)
  }

  const fileSize = fs.statSync(filePath).size
  const CHUNK_SIZE = 10 ** 6
  const [rawStart, rawEnd] = range.replace(/bytes=/, '').split('-')
  const start = Number(rawStart)
  const end = Math.min(Number(rawEnd) || start + CHUNK_SIZE, fileSize - 1)
  const contentLength = end - start + 1
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': mime.lookup(filePath) || 'text/plain',
  }

  res.writeHead(206, headers)

  const stream = fs.createReadStream(filePath, { start, end })
  stream.pipe(res)
}
