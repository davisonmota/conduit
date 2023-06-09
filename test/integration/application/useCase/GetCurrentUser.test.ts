import { PrismaClient } from '@prisma/client'
import UserRepositoryDatabase from '../../../../src/infra/repository/database/UserRepository'
import Signup from '../../../../src/application/useCase/Signup'
import Login from '../../../../src/application/useCase/Login'
import GetCurrentUser from '../../../../src/application/useCase/GetCurrentUser'
import UserQueryDatabase from '../../../../src/infra/query/UserQueryDatabase'
import CheckAuth from '../../../../src/application/useCase/CheckAuth'

const prisma = new PrismaClient()

describe('GetCurrencyUser', () => {
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

  test('Deve retornar o usuário atual(logado)', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)
    const inputSignup = {
      username: 'davison',
      email: 'davison@gmail.com',
      password: '123456789'
    }
    await signup.execute(inputSignup)

    const login = new Login(userRepository)
    const inputLogin = {
      email: 'davison@gmail.com',
      password: '123456789'
    }
    const user = await login.execute(inputLogin)

    const userQuery = new UserQueryDatabase(prisma)
    const checkAuth = new CheckAuth()
    const getCurrentUser = new GetCurrentUser(userQuery, checkAuth)
    const token = user.token ?? ''
    const currencyUser = await getCurrentUser.execute(token)
    expect(currencyUser.username).toBe('davison')
    expect(currencyUser.email).toBe('davison@gmail.com')
    expect(currencyUser.token).toBeTruthy()
    expect(currencyUser.bio).toBe('')
    expect(currencyUser.image).toBe('')
  })

  test('Deve lançar erro se o usuário não for encontrado', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRhdmlzb24iLCJpZCI6IjRjNGZlMjExLWVkZTYtNDM4Ny04ZTc3LWNiNWYyNzk0MDUxOCIsImlhdCI6MTY4NjMzMzQzMjM2MywiZXhwIjoxNjg2MzM0MDM3MTYzfQ.ecrTcDMWvW7kfjGsanEyMcpWPQoOpzqqkbfe5lgxOsw'
    const userQuery = new UserQueryDatabase(prisma)
    const checkAuth = new CheckAuth()
    const getCurrentUser = new GetCurrentUser(userQuery, checkAuth)
    const promise = getCurrentUser.execute(token)
    await expect(promise).rejects.toThrow(new Error('User not found'))
  })
})
