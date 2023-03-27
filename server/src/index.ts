import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

import { errorHandler } from './middlewares/errorHandler'
import { notFound } from './middlewares/notFound'
import api from './api'

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use('/api', api)
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`)
})
