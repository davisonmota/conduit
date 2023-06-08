import { PrismaClient } from '@prisma/client'
import Signup from '../../../../src/application/useCase/Signup'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'
import Login from '../../../../src/application/useCase/Login'
import CheckAuth from '../../../../src/application/useCase/CheckAuth'
import UpdateUser from '../../../../src/application/useCase/UpdateUser'

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
    const signup = new Signup(userRepository)
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
    const updatedUser = await updateUser.execute(user.token, inputUpdateUser)

    expect(updatedUser.token).toBeTruthy()
    expect(updatedUser.token).not.toBe(user.token)
    expect(updatedUser.image).toBe('http://other-image.com/profile.jpg')
    expect(updatedUser.bio).toBe('I love Conduit')
    expect(updatedUser.username).toBe('other-username')
    expect(updatedUser.email).toBe('other@gmail.com')
  })
})
