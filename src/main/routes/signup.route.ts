/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/expressAdapter'
import { makeSignupController } from '../factories/controllers/SignupControllerFactory'

const signup = Router()

signup.post('/users', adaptRoute(makeSignupController()))

export { signup }
