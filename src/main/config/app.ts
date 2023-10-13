import express from 'express'
import { signup } from '../routes/signup.route'
import { login } from '../routes/login.route'

const app = express()
app.use(express.json())

app.use('/api', signup)
app.use('/api', login)

export default app
