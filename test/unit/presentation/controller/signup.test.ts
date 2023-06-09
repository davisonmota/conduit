import { PrismaClient } from '@prisma/client'
import Login from '../../../../src/application/useCase/Login'
import Signup from '../../../../src/application/useCase/Signup'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'
import SignupController from '../../../../src/presentation/controllers/SignupController'
import { MissingParamError } from '../../../../src/presentation/errors/MissingParamError'
import { badRequest } from '../../../../src/presentation/errors/http-helpers'

const prisma = new PrismaClient()

describe('SignupController', () => {
  test('Deve retornar statusCode 400 se o email não for fornecido', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)
    const login = new Login(userRepository)
    const signupController = new SignupController(signup, login)
    const httpRequest = {
      body: {
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Deve retornar statusCode 400 se o username não for fornecido', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)
    const login = new Login(userRepository)
    const signupController = new SignupController(signup, login)
    const httpRequest = {
      body: {
        email: 'davison@gmail.com'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('username')))
  })

  test('Deve retornar statusCode 400 se o password não for fornecido', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)
    const login = new Login(userRepository)
    const signupController = new SignupController(signup, login)
    const httpRequest = {
      body: {
        email: 'davison@gmail.com',
        username: 'davison'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
