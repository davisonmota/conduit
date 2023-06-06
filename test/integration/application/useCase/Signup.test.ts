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

  test('Deve fazer signup', async () => {
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
    expect(user.username).toBe('davison')
    expect(user.email).toBe('davison@gmail.com')
    expect(user.token).toBeTruthy()
    expect(user.bio).toBe('')
    expect(user.image).toBe('')
  })

  test('Não deve fazer signup se username já estiver em uso', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)

    await signup.execute({
      username: 'davison',
      email: 'davison@gmail.com',
      password: '123456789'
    })

    const promise = signup.execute({
      username: 'davison',
      email: 'otheruser@gmail.com',
      password: '987654321'
    })
    await expect(promise).rejects.toThrow(new Error('Username already exist'))
  })

  test('Não deve fazer signup se email já estiver em uso', async () => {
    const userRepository = new UserRepositoryDatabase(prisma)
    const signup = new Signup(userRepository)

    await signup.execute({
      username: 'davison',
      email: 'davison@gmail.com',
      password: '123456789'
    })

    const promise = signup.execute({
      username: 'other-user-name',
      email: 'davison@gmail.com',
      password: '987654321'
    })
    await expect(promise).rejects.toThrow(new Error('Email already in use'))
  })
})
