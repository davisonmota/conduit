import { type PrismaClient } from '@prisma/client'
import type UserRepository from '../../../application/repository/UserRepository'
import User from '../../../domain/entity/User'
import Username from '../../../domain/entity/Username'
import Email from '../../../domain/entity/Email'
import EmailValidatorAdapter from '../../validator/EmailValidatorAdapter'
import Password from '../../../domain/entity/Password'
import Bio from '../../../domain/entity/Bio'
import ImageProfile from '../../../domain/entity/ImageProfile'

export default class UserRepositoryDatabase implements UserRepository {
  constructor (readonly prisma: PrismaClient) {}

  async save (user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.getId(),
        username: user.getUsername(),
        email: user.getEmail(),
        password: user.getPassword()
      }
    })
  }

  async loadByEmail (email: string): Promise<User | undefined> {
    const userData = await this.prisma.user.findUnique({ where: { email } })
    if (!userData) return
    return User.restore({
      id: userData.id,
      bio: new Bio(userData.bio),
      image: new ImageProfile(userData.image),
      username: new Username(userData.username),
      email: new Email(userData.email, new EmailValidatorAdapter()),
      password: Password.restore(userData.password)
    })
  }

  async loadByUsername (username: string): Promise<User | undefined> {
    const userData = await this.prisma.user.findUnique({ where: { username } })
    if (!userData) return
    return User.restore({
      id: userData.id,
      bio: new Bio(userData.bio),
      image: new ImageProfile(userData.image),
      username: new Username(userData.username),
      email: new Email(userData.email, new EmailValidatorAdapter()),
      password: Password.restore(userData.password)
    })
  }

  async update (user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.getId() },
      data: {
        username: user.getUsername(),
        email: user.getEmail(),
        password: user.getPassword(),
        bio: user.getBio(),
        image: user.getImage()
      }
    })
  }
}
