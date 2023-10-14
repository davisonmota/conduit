/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/expressAdapter'
import { makeUpdateUserController } from '../factories/controllers/UpdateUserControllerFactory'

const updateUser = Router()

updateUser.put('/user', adaptRoute(makeUpdateUserController()))

export { updateUser }
