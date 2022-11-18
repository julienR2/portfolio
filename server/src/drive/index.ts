import express, { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import { MEDIA_PATH } from '../constants'

import { listDirectory } from './fileSystem'

const router = express.Router()

router.get('/*', async (req: Request, res: Response) => {
  const filePath = path.join(MEDIA_PATH, req.path)

  if (!fs.existsSync(filePath)) {
    return res.sendStatus(404)
  }

  if (fs.lstatSync(filePath).isDirectory()) {
    const info = listDirectory(req)

    return res.json(info)
  }

  res.sendFile(filePath)
})

export default router
