import { PrismaClient } from '@prisma/client'
import Login from '../../../../src/application/useCase/Login'
import Signup from '../../../../src/application/useCase/Signup'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'

const prisma = new PrismaClient()

describe('Signup', () => {
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

  test('Não deve fazer login se usuário não existir', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const login = new Login(userRepository)
    const inputLogin = {
      email: 'fakeuser@gmail.com',
      password: '123456789'
    }
    const promise = login.execute(inputLogin)

    await expect(promise).rejects.toThrow(new Error('Authentication fails'))
  })
})
