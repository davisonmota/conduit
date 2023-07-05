import { type PrismaClient } from '@prisma/client'
import type UserQuery from '../../application/Query/UserQuery'

export default class UserQueryDatabase implements UserQuery {
  constructor (readonly prisma: PrismaClient) {}

  async findById (id: string): Promise<UserQueryOutput | undefined> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
      select: {
        username: true,
        email: true,
        bio: true,
        image: true
      }
    })
    if (!userData) return
    return {
      user: {
        username: userData.username,
        email: userData.email,
        bio: userData.bio,
        image: userData.image
      }
    }
  }
}

export type UserQueryOutput = {
  user: {
    username: string
    email: string
    bio: string
    image: string
  }
}
