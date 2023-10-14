import express from 'express'
import { signup } from '../routes/signup.route'
import { login } from '../routes/login.route'
import { updateUser } from '../routes/updateUser.route'

const app = express()
app.use(express.json())

app.use('/api', signup)
app.use('/api', login)
app.use('/api', updateUser)

export default app
