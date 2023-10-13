import supertest from 'supertest'
import app from '../../../src/main/config/app'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Signup Routes', () => {
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

  describe('POST /api/users/login', () => {
    test('Deve retornar 200 ao logar o usuário', async () => {
      await supertest(app)
        .post('/api/users')
        .send({
          user: {
            email: 'davison@gmail.com',
            username: 'davison',
            password: '123456789'
          }
        }).expect(201)

      await supertest(app)
        .post('/api/users/login')
        .send({
          user: {
            email: 'davison@gmail.com',
            password: '123456789'
          }
        }).expect(200)
    })
  })
})
