import express from 'express'
import cors from 'cors'

import { supabaseAuth } from '../middlewares/supabaseAuth'

import storage from './storage/router'
import scripts from './scripts/router'

const router = express.Router()

router.get('/', (_, res) => {
  res.json({ message: 'hello world' })
})

router.use(cors())
router.use('/scripts', supabaseAuth, scripts)
router.use('/storage', supabaseAuth, storage)

export default router
