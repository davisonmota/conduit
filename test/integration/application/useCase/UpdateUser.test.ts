import { PrismaClient } from '@prisma/client'
import Signup from '../../../../src/application/useCase/Signup'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'
import Login from '../../../../src/application/useCase/Login'
import CheckAuth from '../../../../src/application/useCase/CheckAuth'
import UpdateUser from '../../../../src/application/useCase/UpdateUser'
import { InvalidParamError } from '../../../../src/presentation/errors/InvalidParamError'
import VerifyExistUser from '../../../../src/domain/service/VerifyExistUser'

const prisma = new PrismaClient()

describe('Update User', () => {
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
    await signup.execute({
      username: 'davison',
      email: 'davison@gmail.com',
      password: '123456789'
    })
    const login = new Login(userRepository)
    const user = await login.execute({
      email: 'davison@gmail.com',
      password: '123456789'
    })
    const inputUpdateUser = {
      image: 'http://other-image.com/profile.jpg',
      bio: 'I love Conduit',
      password: '987654321',
      username: 'other-username',
      email: 'other@gmail.com'
    }

    const checkAuth = new CheckAuth()
    const updateUser = new UpdateUser(userRepository, checkAuth)
    const updatedUser = await updateUser.execute(user.user.token, inputUpdateUser)

    expect(updatedUser.user.token).toBeTruthy()
    expect(updatedUser.user.token).not.toBe(user.user.token)
    expect(updatedUser.user.image).toBe('http://other-image.com/profile.jpg')
    expect(updatedUser.user.bio).toBe('I love Conduit')
    expect(updatedUser.user.username).toBe('other-username')
    expect(updatedUser.user.email).toBe('other@gmail.com')
  })

  test('Deve lançar erro se o usuário não for encontrado', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRhdmlzb24iLCJpYXQiOjE2ODYyNTU0NDY5NDUsImV4cCI6MTY4NjI1NjA1MTc0NX0.oLeLWIpxC-DNZm449Mm5ynkBpGJCFSEdPXJJ8XOdEqU'
    const checkAuth = new CheckAuth()
    const updateUser = new UpdateUser(userRepository, checkAuth)
    const inputUpdateUser = {
      image: 'http://other-image.com/profile.jpg',
      bio: 'I love Conduit',
      password: '987654321',
      username: 'other-username',
      email: 'other@gmail.com'
    }
    const promise = updateUser.execute(token, inputUpdateUser)
    await expect(promise).rejects.toThrow(new Error('User not found'))
  })

  test('Deve lançar erro InvalidParamError se fornecer parâmetro inválido', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const verifyExistUser = new VerifyExistUser(userRepository)
    const signup = new Signup(userRepository, verifyExistUser)
    await signup.execute({
      username: 'davison',
      email: 'davison@gmail.com',
      password: '123456789'
    })
    const login = new Login(userRepository)
    const user = await login.execute({
      email: 'davison@gmail.com',
      password: '123456789'
    })
    const inputUpdateUser = {
      id: 'invalid-id',
      otherParamInvalid: 'other-param-invalid'
    }

    const checkAuth = new CheckAuth()
    const updateUser = new UpdateUser(userRepository, checkAuth)
    const promise = updateUser.execute(user.user.token, inputUpdateUser)

    await expect(promise).rejects.toThrow(new InvalidParamError('id'))
  })
})
