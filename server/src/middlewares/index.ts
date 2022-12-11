import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { networkInterfaces } from 'os'

import { IS_DEV } from '../constants'
import { JwtPayload } from '../types'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404)
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
  next(error)
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // Require for the error middleware to fire
  next: NextFunction,
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: !IS_DEV ? '🥞' : err.stack,
  })
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers

  if (!authorization) {
    res.status(401)
    throw new Error('🚫 Un-Authorized 🚫')
  }

  try {
    const token = authorization.split(' ')[1]
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || '',
    ) as JwtPayload

    req.payload = payload
  } catch (err) {
    const { name } = err as Error
    res.status(401)
    if (name === 'TokenExpiredError') {
      throw new Error(name)
    }
    throw new Error('🚫 Un-Authorized 🚫')
  }

  return next()
}
