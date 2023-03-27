import express from 'express'
import cors from 'cors'

import { supabaseAuth } from '../middlewares/supabaseAuth'

import scripts from './scripts/router'
import storage from './storage/router'

const router = express.Router()

router.get('/', (_, res) => {
  res.json({ message: 'hello world' })
})

router.use(cors())
router.use('/scripts', supabaseAuth, scripts)
router.use('/storage', supabaseAuth, storage)

export default router
