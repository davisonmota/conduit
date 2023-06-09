import { type PrismaClient } from '@prisma/client'
import type UserQuery from '../../application/Query/UserQuery'
import { type UserOutPut } from '../../application/useCase/dto/UserOutPut'

export default class UserQueryDatabase implements UserQuery {
  constructor (readonly prisma: PrismaClient) {}

  async findById (id: string): Promise<Omit<UserOutPut, 'token'> | undefined> {
    const userData = await this.prisma.user.findUnique({ where: { id } })
    if (!userData) return
    return {
      username: userData.username,
      email: userData.email,
      bio: userData.bio,
      image: userData.image
    }
  }
}
