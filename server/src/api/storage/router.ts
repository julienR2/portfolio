import express, { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import mime from 'mime-types'
import formidable from 'formidable'

import { FILES_PATH, UPLOADS_PATH } from '../../constants'
import { getRequestUrl } from '../../utils'

import { listDirectory } from './fileSystem'

const router = express.Router()

router.get('/files', async (req: Request, res: Response) => {
  const filePath = path.join(FILES_PATH, decodeURI(req.path))

  if (!fs.existsSync(filePath)) {
    return res.sendStatus(404)
  }

  if (fs.lstatSync(filePath).isDirectory()) {
    const currentUrl = getRequestUrl(req)
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

router.post('/upload', function (req, res, next) {
  try {
    const form = formidable({ uploadDir: UPLOADS_PATH })

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err)
        return
      }

      console.log({ fields, files })
    })
  } catch (err) {
    console.log(err)
  }
})

export default router
