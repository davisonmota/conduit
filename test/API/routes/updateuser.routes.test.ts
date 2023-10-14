/* eslint-disable @typescript-eslint/restrict-template-expressions */
import supertest from 'supertest'
import app from '../../../src/main/config/app'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('UpdateUser Routes', () => {
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

  describe('PUT /api/user', () => {
    test('Deve retornar 200 ao atualizar os dados do usuário', async () => {
      const response = await supertest(app)
        .post('/api/users')
        .send({
          user: {
            email: 'davison@gmail.com',
            username: 'davison',
            password: '123456789'
          }
        }).expect(201)

      const updateResponse = await supertest(app)
        .put('/api/user')
        .set('Authorization', `Token ${response.body.user.token}`)
        .send({
          user: {
            email: 'update@gmail.com',
            username: 'update-username',
            bio: 'update bio',
            image: 'http://updateimage.com.br/update-image.jpg'
          }
        })
      expect(updateResponse.body.user.email).toBe('update@gmail.com')
      expect(updateResponse.body.user.username).toBe('update-username')
      expect(updateResponse.body.user.bio).toBe('update bio')
      expect(updateResponse.body.user.image).toBe('http://updateimage.com.br/update-image.jpg')
      expect(updateResponse.body.user.token).toBeTruthy()
    })
  })
})
