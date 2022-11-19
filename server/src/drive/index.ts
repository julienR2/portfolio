import express, { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import mime from 'mime-types'

import { MEDIA_PATH } from '../constants'

import { listDirectory } from './fileSystem'

const router = express.Router()

router.get('/*', async (req: Request, res: Response) => {
  const filePath = path.join(MEDIA_PATH, decodeURI(req.path))

  if (!fs.existsSync(filePath)) {
    return res.sendStatus(404)
  }

  if (fs.lstatSync(filePath).isDirectory()) {
    const currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    const info = listDirectory(filePath, currentUrl)

    return res.json(info)
  }

  const range = req.headers.range

  if (!range) {
    return res.sendFile(filePath)
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
})

export default router