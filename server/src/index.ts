import express from 'express'

import api from './api'
import { errorHandler } from './middlewares/errorHandler'
import { notFound } from './middlewares/notFound'
import { env } from './constants'

const app = express()
const port = env.PORT || 5000

app.use(express.json())
app.use('/api', api)
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`)
})
