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

  describe('POST /api/users', () => {
    test('Deve retornar 201 ao criar um usuário', async () => {
      await supertest(app)
        .post('/api/users')
        .send({
          user: {
            email: 'davison@gmail.com',
            username: 'davison',
            password: '123456789'
          }
        }).expect(201)
    })
  })
})
