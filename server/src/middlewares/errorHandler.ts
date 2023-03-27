import { Request, Response } from 'express'

import { IS_DEV } from '../constants'

export const errorHandler = (err: Error, req: Request, res: Response) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: !IS_DEV ? '🥞' : err.stack,
  })
}
