require('dotenv').config()
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: 'prod.env' })
}

import express from 'express'

import scriptsRouter from './scripts/router'
import filesRouter from './files'
import { supabaseMiddleware } from './utils/supabase'

async function init() {
  const app = express()
  const port = process.env.PORT || 5000

  app.use('/api/scripts', supabaseMiddleware, scriptsRouter)
  app.use('/api/files', supabaseMiddleware, filesRouter)
  app.get('/api', (req, res) => {
    res.send('Hello World')
  })

  app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`)
  })
}

init()
