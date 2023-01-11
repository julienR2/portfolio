import express from 'express'

import { isAuthenticated } from '../middlewares'

import auth from './auth/router'
import users from './users/router'
import scripts from './users/router'
import storage from './storage/router'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'hello world' })
})

router.use('/auth', auth)
router.use('/users', isAuthenticated, users)
router.use('/scripts', isAuthenticated, scripts)
router.use('/storage', isAuthenticated, storage)

export default router
