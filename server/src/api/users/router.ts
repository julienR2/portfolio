import express from 'express'
import { isAuthenticated } from '../../middlewares'

import { findUserById } from './services'

const router = express.Router()

router.get('/profile', isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload?.userId || ''
    const user = await findUserById(userId)

    if (!user) {
      res.sendStatus(404)
      throw new Error('User not found')
    }

    const { password, ...partialUser } = user

    res.json(partialUser)
  } catch (err) {
    next(err)
  }
})

export default router
