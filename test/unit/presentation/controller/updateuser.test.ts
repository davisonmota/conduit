import { PrismaClient } from '@prisma/client'
import CheckAuth from '../../../../src/application/useCase/CheckAuth'
import Login from '../../../../src/application/useCase/Login'
import Signup from '../../../../src/application/useCase/Signup'
import UpdateUser from '../../../../src/application/useCase/UpdateUser'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'
import UpdateUserController from '../../../../src/presentation/controllers/UpdateUserController'
import { type HttpRequest } from '../../../../src/presentation/http/HttpRequest'
import { badRequest, serverError, unprocessableContent } from '../../../../src/presentation/errors/http-helpers'
import { InvalidTokenError } from '../../../../src/presentation/errors/InvalidTokenError'
import { MissingParamError } from '../../../../src/presentation/errors/MissingParamError'
import { InvalidParamError } from '../../../../src/presentation/errors/InvalidParamError'
import VerifyExistUser from '../../../../src/domain/service/VerifyExistUser'
import { UsernameInUserError } from '../../../../src/presentation/errors/UsernameInUserError'
import { EmailInUserError } from '../../../../src/presentation/errors/EmailInUserError'

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
    const verifyExistUser = new VerifyExistUser(userRepository)
    const signup = new Signup(userRepository, verifyExistUser)
    const userDataCreate = {
      email: 'valid@gmail.com',
      username: 'valid-username',
      password: '123456789'
    }
    await signup.execute(userDataCreate)
    const loginUseCase = new Login(userRepository)
    const userLogin = await loginUseCase.execute({ email: 'valid@gmail.com', password: '123456789' })
    const checkAuth = new CheckAuth()
    const updateUserUseCase = new UpdateUser(userRepository, checkAuth)
    const updateUserController = new UpdateUserController(updateUserUseCase, verifyExistUser)
    const httpRequest: HttpRequest = {
      header: {
        authorization: `Token ${userLogin.user.token}`
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
    const verifyExistUser = new VerifyExistUser(userRepository)
    const userUpdateController = new UpdateUserController(updateUserUseCase, verifyExistUser)
    const httpResponse = await userUpdateController.handle({
      header: {
        authorization: 'Token anyToken'
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
    const verifyExistUser = new VerifyExistUser(userRepository)
    const userUpdateController = new UpdateUserController(updateUserUseCase, verifyExistUser)
    const httpResponse = await userUpdateController.handle({
      header: {
        authorization: 'Token invalidToken'
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

  test('Deve retornar statusCode 400 se não fornecer token (Authorization)', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const checkAuth = new CheckAuth()
    const updateUserUseCase = new UpdateUser(userRepository, checkAuth)
    const verifyExistUser = new VerifyExistUser(userRepository)
    const userUpdateController = new UpdateUserController(updateUserUseCase, verifyExistUser)
    const httpResponse = await userUpdateController.handle({
      header: {
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
    expect(httpResponse).toEqual(badRequest(new MissingParamError('Authorization')))
  })

  test('Deve retornar statusCode 400 se não fornecer heder', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const checkAuth = new CheckAuth()
    const updateUserUseCase = new UpdateUser(userRepository, checkAuth)
    const verifyExistUser = new VerifyExistUser(userRepository)
    const userUpdateController = new UpdateUserController(updateUserUseCase, verifyExistUser)
    const httpResponse = await userUpdateController.handle({

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
    expect(httpResponse).toEqual(badRequest(new MissingParamError('Header')))
  })

  test('Deve retornar statusCode 400 se não fornecer body', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const checkAuth = new CheckAuth()
    const updateUserUseCase = new UpdateUser(userRepository, checkAuth)
    const verifyExistUser = new VerifyExistUser(userRepository)
    const userUpdateController = new UpdateUserController(updateUserUseCase, verifyExistUser)
    const httpResponse = await userUpdateController.handle({
      header: {
        authorization: 'Token validToken'
      }
    })
    expect(httpResponse).toEqual(badRequest(new MissingParamError('body')))
  })

  test('Deve retornar statusCode 400 se não fornecer user', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const checkAuth = new CheckAuth()
    const updateUserUseCase = new UpdateUser(userRepository, checkAuth)
    const verifyExistUser = new VerifyExistUser(userRepository)
    const userUpdateController = new UpdateUserController(updateUserUseCase, verifyExistUser)
    const httpResponse = await userUpdateController.handle({
      header: {
        authorization: 'Token validToken'
      },
      body: {
      }
    })
    expect(httpResponse).toEqual(badRequest(new MissingParamError('user')))
  })

  test('Deve retornar statusCode 400 se user for vazio', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const checkAuth = new CheckAuth()
    const updateUserUseCase = new UpdateUser(userRepository, checkAuth)
    const verifyExistUser = new VerifyExistUser(userRepository)
    const userUpdateController = new UpdateUserController(updateUserUseCase, verifyExistUser)
    const httpResponse = await userUpdateController.handle({
      header: {
        authorization: 'Token validToken'
      },
      body: {
        user: {}
      }
    })
    expect(httpResponse).toEqual(badRequest(new MissingParamError('Empty user')))
  })

  test('Deve retornar 422 if algum parâmetro do user for inválido', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const verifyExistUser = new VerifyExistUser(userRepository)
    const signupUseCase = new Signup(userRepository, verifyExistUser)
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
    const updateUserController = new UpdateUserController(updateUserUseCase, verifyExistUser)
    const httpRequest: HttpRequest = {
      header: {
        authorization: `Token ${userLogin.user.token}`
      },
      body: {
        user: {
          email: 'update@gmail.com',
          username: 'update-username',
          password: 'update-123456789',
          bio: 'update bio',
          image: 'invalidImage'
        }
      }
    }
    const httpResponse = await updateUserController.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableContent(new InvalidParamError('url image profile')))
  })

  test('Deve retornar 422 username já estiver em uso', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const verifyExistUser = new VerifyExistUser(userRepository)
    const signupUseCase = new Signup(userRepository, verifyExistUser)
    const userDataCreate = {
      email: 'valid@gmail.com',
      username: 'in-use-username',
      password: '123456789'
    }
    await signupUseCase.execute(userDataCreate)
    const loginUseCase = new Login(userRepository)
    const userLogin = await loginUseCase.execute({ email: 'valid@gmail.com', password: '123456789' })
    const checkAuth = new CheckAuth()
    const updateUserUseCase = new UpdateUser(userRepository, checkAuth)
    const updateUserController = new UpdateUserController(updateUserUseCase, verifyExistUser)
    const httpRequest: HttpRequest = {
      header: {
        authorization: `Token ${userLogin.user.token}`
      },
      body: {
        user: {
          username: 'in-use-username'
        }
      }
    }
    const httpResponse = await updateUserController.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableContent(new UsernameInUserError()))
  })

  test('Deve retornar 422 email já estiver em uso', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const verifyExistUser = new VerifyExistUser(userRepository)
    const signupUseCase = new Signup(userRepository, verifyExistUser)
    const userDataCreate = {
      email: 'in-use-email@gmail.com',
      username: 'username',
      password: '123456789'
    }
    await signupUseCase.execute(userDataCreate)
    const loginUseCase = new Login(userRepository)
    const userLogin = await loginUseCase.execute({ email: 'in-use-email@gmail.com', password: '123456789' })
    const checkAuth = new CheckAuth()
    const updateUserUseCase = new UpdateUser(userRepository, checkAuth)
    const updateUserController = new UpdateUserController(updateUserUseCase, verifyExistUser)
    const httpRequest: HttpRequest = {
      header: {
        authorization: `Token ${userLogin.user.token}`
      },
      body: {
        user: {
          email: 'in-use-email@gmail.com'
        }
      }
    }
    const httpResponse = await updateUserController.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableContent(new EmailInUserError()))
  })
})
