import { PrismaClient } from '@prisma/client'
import Login from '../../../../src/application/useCase/Login'
import Signup from '../../../../src/application/useCase/Signup'
import { type UserOutPut } from '../../../../src/application/useCase/dto/UserOutPut'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'
import SignupController from '../../../../src/presentation/controllers/SignupController'
import { EmailInUserError } from '../../../../src/presentation/errors/EmailInUserError'
import { InvalidParamError } from '../../../../src/presentation/errors/InvalidParamError'
import { MissingParamError } from '../../../../src/presentation/errors/MissingParamError'
import { UsernameInUserError } from '../../../../src/presentation/errors/UsernameInUserError'
import { badRequest, created, serverError, unprocessableContent } from '../../../../src/presentation/errors/http-helpers'

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
    const signup = new Signup(userRepository)
    const login = new Login(userRepository)
    const signupController = new SignupController(signup, login)
    const httpRequest = {
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('body')))
  })

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

  test('Deve retornar statusCode 422 se o email já estiver em uso', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)
    const login = new Login(userRepository)
    jest.spyOn(signup, 'execute').mockRejectedValueOnce(new EmailInUserError())
    const signupController = new SignupController(signup, login)
    const httpRequest = {
      body: {
        email: 'davison@gmail.com',
        username: 'other-username',
        password: '123456789'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new EmailInUserError()))
  })

  test('Deve retornar statusCode 422 se o username já estiver em uso', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)
    const login = new Login(userRepository)
    jest.spyOn(signup, 'execute').mockRejectedValueOnce(new UsernameInUserError())
    const signupController = new SignupController(signup, login)
    const httpRequest = {
      body: {
        email: 'other@gmail.com',
        username: 'davison',
        password: '123456789'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new UsernameInUserError()))
  })

  test('Deve retornar statusCode 422 se o email for inválido', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)
    const login = new Login(userRepository)
    const signupController = new SignupController(signup, login)
    const httpRequest = {
      body: {
        email: 'invalid-email#gmail.com',
        username: 'valid-username',
        password: '123456789'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableContent(new InvalidParamError('email')))
  })

  test('Deve retornar statusCode 422 se o username for inválido', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)
    const login = new Login(userRepository)
    const signupController = new SignupController(signup, login)
    const httpRequest = {
      body: {
        email: 'valid@gmail.com',
        username: 'invalid username',
        password: '123456789'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableContent(new InvalidParamError('username')))
  })

  test('Deve retornar statusCode 422 se o password for inválido (menor que 8 caracteres)', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)
    const login = new Login(userRepository)
    const signupController = new SignupController(signup, login)
    const httpRequest = {
      body: {
        email: 'valid@gmail.com',
        username: 'valid-username',
        password: '123456'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableContent(new InvalidParamError('password')))
  })

  test('Deve retornar statusCode 500 com erro inesperado', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)
    const login = new Login(userRepository)
    jest.spyOn(signup, 'execute').mockRejectedValueOnce(new Error())
    const signupController = new SignupController(signup, login)
    const httpRequest = {
      body: {
        email: 'valid@gmail.com',
        username: 'valid-username',
        password: '123456789'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  test('Deve retornar statusCode 200 com usuário logado', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)
    const login = new Login(userRepository)
    jest.spyOn(signup, 'execute').mockResolvedValueOnce()
    const userOutput: UserOutPut = {
      email: 'valid@gmail.com',
      username: 'valid-username',
      bio: 'any bio',
      image: 'http://image.com/any-profile.png',
      token: 'valid-token'
    }
    jest.spyOn(login, 'execute').mockResolvedValueOnce(userOutput)
    const signupController = new SignupController(signup, login)
    const httpRequest = {
      body: {
        email: 'valid@gmail.com',
        username: 'valid-username',
        password: '123456789'
      }
    }
    const httpResponse = await signupController.handle(httpRequest)
    expect(httpResponse).toEqual(created({
      email: 'valid@gmail.com',
      username: 'valid-username',
      bio: 'any bio',
      image: 'http://image.com/any-profile.png',
      token: 'valid-token'
    }))
  })
})
