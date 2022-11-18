require('dotenv').config()

import express from 'express'

import scriptsRouter from './scripts'
import driveRouter from './drive'
import { supabaseMiddleware } from './utils/supabase'

const app = express()
const port = process.env.PORT || 5000

app.use('/api/scripts', supabaseMiddleware, scriptsRouter)
app.use('/api/drive', supabaseMiddleware, driveRouter)
app.get('/api', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`)
})
