import express from 'express'
import { signup } from '../routes/signup.route'

const app = express()
app.use(express.json())

app.use('/api', signup)

export default app
