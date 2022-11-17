import express, { Request, Response } from 'express'

import * as activoBank from './activobank'
import * as bankin from './bankin'

const scripts = {
  activoBank,
  bankin,
}

const router = express.Router()

router.get('/run', async (req: Request, res: Response) => {
  await Promise.all(Object.values(scripts).map((script) => script.run()))

  res.sendStatus(200)
})

export default router
