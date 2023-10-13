import { PrismaClient } from '@prisma/client'
import Login from '../../../../src/application/useCase/Login'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'
import LoginController from '../../../../src/presentation/controllers/LoginController'
import { badRequest } from '../../../../src/presentation/errors/http-helpers'
import { MissingParamError } from '../../../../src/presentation/errors/MissingParamError'
import Signup from '../../../../src/application/useCase/Signup'

const prisma = new PrismaClient()

describe('SignupController', () => {
  beforeAll(async () => {
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  afterEach(async () => {
    await prisma.user.deleteMany()
  })

  test('Deve retornar statusCode 400 se o body não for fornecido', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const login = new Login(userRepository)
    const loginController = new LoginController(login)
    const httpRequest = {}
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('body')))
  })

  test('Deve retornar statusCode 400 se o email não for fornecido', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const login = new Login(userRepository)
    const loginController = new LoginController(login)
    const httpRequest = {
      body: {
        user: {}
      }
    }
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Deve retornar statusCode 400 se password não for fornecido', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const login = new Login(userRepository)
    const loginController = new LoginController(login)
    const httpRequest = {
      body: {
        user: {
          email: 'any@email.com'
        }
      }
    }
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Deve retornar statusCode 200 com usuário logado', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signupUseCase = new Signup(userRepository)
    const user = {
      email: 'valid@gmail.com',
      username: 'valid-username',
      password: '123456789'
    }
    await signupUseCase.execute(user)

    const login = new Login(userRepository)
    const loginController = new LoginController(login)
    const httpRequest = {
      body: {
        user: {
          email: 'valid@gmail.com',
          password: '123456789'
        }
      }
    }
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.user.email).toBe('valid@gmail.com')
    expect(httpResponse.body.user.token).toBeTruthy()
  })
})
