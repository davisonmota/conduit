import { PrismaClient } from '@prisma/client'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'
import Login from '../../../../src/application/useCase/Login'
import Signup from '../../../../src/application/useCase/Signup'
import CheckAuth from '../../../../src/application/useCase/CheckAuth'

const prisma = new PrismaClient()

describe('Check Auth', () => {
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

  test('Deve verificar se o usuário está autenticado', async () => {
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

    const checkAuth = new CheckAuth()
    const output = await checkAuth.execute(user.token)
    expect(output.username).toBe('davison')
  })
})
