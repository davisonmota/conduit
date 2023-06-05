import { type PrismaClient } from '@prisma/client'
import type UserRepository from '../../../application/repository/UserRepository'
import User from '../../../domain/entity/User'
import Username from '../../../domain/entity/Username'
import Email from '../../../domain/entity/Email'
import EmailValidatorAdapter from '../../validator/EmailValidatorAdapter'
import Password from '../../../domain/entity/Password'

export default class UserRepositoryDatabase implements UserRepository {
  constructor (readonly prisma: PrismaClient) {}

  async save (user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        username: user.getUsername(),
        email: user.getEmail(),
        password: user.getPassword()
      }
    })
  }

  async loadByEmail (email: string): Promise<User | undefined> {
    const userData = await this.prisma.user.findUnique({ where: { email } })
    if (!userData) return
    return User.restore(
      new Username(userData.username),
      new Email(userData.email, new EmailValidatorAdapter()),
      Password.restore(userData.password)
    )
  }

  async loadByUsername (username: string): Promise<User | undefined> {
    const userData = await this.prisma.user.findUnique({ where: { username } })
    if (!userData) return
    return User.restore(
      new Username(userData.username),
      new Email(userData.email, new EmailValidatorAdapter()),
      Password.restore(userData.password)
    )
  }
}
