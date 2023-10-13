/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/expressAdapter'
import { makeLoginController } from '../factories/controllers/LoginControllerFactory'

const login = Router()

login.post('/users/login', adaptRoute(makeLoginController()))

export { login }
