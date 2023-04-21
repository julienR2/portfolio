import path from 'path'
import fs from 'fs'

import express, { Request, Response } from 'express'
import mime from 'mime-types'

import { MEDIA_PATH } from '../../constants'

const router = express.Router()

router.get('*', (req: Request, res: Response) => {
  const filePath = path.join(MEDIA_PATH, decodeURI(req.path))

  if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
    return res.sendStatus(404)
  }

  const range = req.headers.range
  console.log('filePath', filePath)
  if (!range) {
    console.log('range', range)
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
