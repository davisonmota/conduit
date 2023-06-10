/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import Login from '../../application/useCase/Login'
import Signup from '../../application/useCase/Signup'
import UserRepositoryDatabase from '../../infra/repository/database/UserRepository'
import SignupController from '../../presentation/controllers/SignupController'
import { adaptRoute } from '../adapters/expresAdapter'
import prisma from '../database/client'

const signup = Router()

const useRepository = new UserRepositoryDatabase(prisma)
const signupUseCase = new Signup(useRepository)
const loginUseCase = new Login(useRepository)
const signupController = new SignupController(signupUseCase, loginUseCase)

signup.post('/signup', adaptRoute(signupController))

export { signup }
