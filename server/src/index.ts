require('dotenv').config()
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: 'prod.env' })
}

import express from 'express'

import api from './api'
import { errorHandler, notFound } from './middlewares'

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use('/api', api)
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`)
})
