import express from 'express'
import cors from 'cors'

import { supabaseAuth } from '../middlewares/supabaseAuth'

import media from './media/router'
import storage from './storage/router'
import scripts from './scripts/router'

const router = express.Router()

router.get('/', (_, res) => {
  res.json({ message: 'hello world' })
})

router.use(cors())
router.use('/scripts', supabaseAuth, scripts)
router.use('/storage', supabaseAuth, storage)
router.use('/media', supabaseAuth, media)

export default router
