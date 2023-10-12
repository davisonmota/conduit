import { PrismaClient } from '@prisma/client'
import Login from '../../../../src/application/useCase/Login'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'
import LoginController from '../../../../src/presentation/controllers/LoginController'
import { badRequest } from '../../../../src/presentation/errors/http-helpers'
import { MissingParamError } from '../../../../src/presentation/errors/MissingParamError'

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
})
