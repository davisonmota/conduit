import { PrismaClient } from '@prisma/client'
import Login from '../../../../src/application/useCase/Login'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'
import LoginController from '../../../../src/presentation/controllers/LoginController'
import { badRequest, serverError, unprocessableContent } from '../../../../src/presentation/errors/http-helpers'
import { MissingParamError } from '../../../../src/presentation/errors/MissingParamError'
import Signup from '../../../../src/application/useCase/Signup'
import { InvalidCredentials } from '../../../../src/presentation/errors/InvalidCredentials'
import VerifyExistUser from '../../../../src/domain/service/VerifyExistUser'

const prisma = new PrismaClient()

describe('LoginController', () => {
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
    expect(httpResponse).toEqual(badRequest(new MissingParamError('user')))
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
    const verifyExistUser = new VerifyExistUser(userRepository)
    const signup = new Signup(userRepository, verifyExistUser)
    const user = {
      email: 'valid@gmail.com',
      username: 'valid-username',
      password: '123456789'
    }
    await signup.execute(user)

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

  test('Deve retornar statusCode 500 com erro inesperado', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const login = new Login(userRepository)
    jest.spyOn(login, 'execute').mockRejectedValueOnce(new Error())
    const loginController = new LoginController(login)
    const httpRequest = {
      body: {
        user: {
          email: 'valid@gmail.com',
          username: 'valid-username',
          password: '123456789'
        }
      }
    }

    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  test('Deve retornar statusCode 422 se dados válidos, mas incorretos forem fornecidos', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const verifyExistUser = new VerifyExistUser(userRepository)
    const signup = new Signup(userRepository, verifyExistUser)
    const user = {
      email: 'valid@gmail.com',
      username: 'valid-username',
      password: '123456789'
    }
    await signup.execute(user)

    const login = new Login(userRepository)
    const loginController = new LoginController(login)
    const httpRequest = {
      body: {
        user: {
          email: 'incorrect@gmail.com',
          password: 'incorrect-123456789'
        }
      }
    }
    const httpResponse = await loginController.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableContent(new InvalidCredentials()))
  })
})
