import { createClient } from '@supabase/supabase-js'
import { NextFunction, Request, Response } from 'express'

import { Database } from '../../../types/supabase'
import { IS_DEV } from '../constants'

export const supabaseService = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || '',
)

declare global {
  namespace Express {
    export interface Request {
      supabase: typeof supabaseService
    }
  }
}

const getToken = (req: Request) => req.headers?.authorization?.split(' ')[1]

export const supabaseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (IS_DEV) {
    return next()
  }

  const token = getToken(req)

  if (!token) {
    return res.sendStatus(404)
  }

  const supabase = createClient<Database>(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || '',
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  )

  const { error } = await supabase.auth.getUser()

  if (error) {
    return res.sendStatus(403)
  }

  req['supabase'] = supabase

  return next()
}
