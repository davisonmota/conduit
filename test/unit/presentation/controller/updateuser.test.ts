import { PrismaClient } from '@prisma/client'
import CheckAuth from '../../../../src/application/useCase/CheckAuth'
import Login from '../../../../src/application/useCase/Login'
import Signup from '../../../../src/application/useCase/Signup'
import UpdateUser from '../../../../src/application/useCase/UpdateUser'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'
import UpdateUserController from '../../../../src/presentation/controllers/UpdateUserController'
import { type HttpRequest } from '../../../../src/presentation/http/HttpRequest'
import { serverError, unprocessableContent } from '../../../../src/presentation/errors/http-helpers'
import { InvalidTokenError } from '../../../../src/presentation/errors/InvalidTokenError'

const prisma = new PrismaClient()

describe('UpdateUserController', () => {
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

  test('Deve atualizar os dados do usuário', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signupUseCase = new Signup(userRepository)
    const userDataCreate = {
      email: 'valid@gmail.com',
      username: 'valid-username',
      password: '123456789'
    }
    await signupUseCase.execute(userDataCreate)
    const loginUseCase = new Login(userRepository)
    const userLogin = await loginUseCase.execute({ email: 'valid@gmail.com', password: '123456789' })
    const checkAuth = new CheckAuth()
    const updateUserUseCase = new UpdateUser(userRepository, checkAuth)
    const updateUserController = new UpdateUserController(updateUserUseCase)
    const httpRequest: HttpRequest = {
      header: {
        Authorization: `Token ${userLogin.user.token}`
      },
      body: {
        user: {
          email: 'update@gmail.com',
          username: 'update-username',
          password: 'update-123456789',
          bio: 'update bio',
          image: 'https://update-image.com/update-image.jpg'
        }
      }
    }
    const httpResponse = await updateUserController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.user.email).toBe('update@gmail.com')
    expect(httpResponse.body.user.username).toBe('update-username')
    expect(httpResponse.body.user.bio).toBe('update bio')
    expect(httpResponse.body.user.image).toBe('https://update-image.com/update-image.jpg')
    expect(httpResponse.body.user.token).not.toBe(userLogin.user.token)
  })

  test('Deve retornar statusCode 500 se ocorrer algum error inesperado', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const checkAuth = new CheckAuth()
    const updateUserUseCase = new UpdateUser(userRepository, checkAuth)
    jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(new Error('Internal server error'))
    const userUpdateController = new UpdateUserController(updateUserUseCase)
    const httpResponse = await userUpdateController.handle({
      header: {
        Authorization: 'Token anyToken'
      },
      body: {
        user: {
          email: 'update@gmail.com',
          username: 'update-username',
          password: 'update-123456789',
          bio: 'update bio',
          image: 'https://update-image.com/update-image.jpg'
        }
      }
    })
    expect(httpResponse).toEqual(serverError())
  })

  test('Deve retornar statusCode 422 se token for inválido', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const checkAuth = new CheckAuth()
    const updateUserUseCase = new UpdateUser(userRepository, checkAuth)
    const userUpdateController = new UpdateUserController(updateUserUseCase)
    const httpResponse = await userUpdateController.handle({
      header: {
        Authorization: 'Token invalidToken'
      },
      body: {
        user: {
          email: 'update@gmail.com',
          username: 'update-username',
          password: 'update-123456789',
          bio: 'update bio',
          image: 'https://update-image.com/update-image.jpg'
        }
      }
    })
    expect(httpResponse).toEqual(unprocessableContent(new InvalidTokenError()))
  })
})
