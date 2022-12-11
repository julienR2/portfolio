import express from 'express'

import auth from './auth/router'
import users from './users/router'
import scripts from './users/router'
import files from './files'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'hello world' })
})

router.use('/auth', auth)
router.use('/users', users)
router.use('/scripts', scripts)
router.use('/files', files)

export default router
