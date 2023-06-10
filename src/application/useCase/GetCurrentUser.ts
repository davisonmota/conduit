import TokenGenerator from '../../domain/service/TokenGenerator'
import env from '../../main/config/env'
import type UserQuery from '../Query/UserQuery'
import type CheckAuth from './CheckAuth'
import { type UserOutPut } from './dto/UserOutPut'

export default class GetCurrentUser {
  constructor (readonly userQuery: UserQuery, readonly checkAuth: CheckAuth) {}

  async execute (token: string): Promise<UserOutPut> {
    const { id, username } = await this.checkAuth.execute(token)
    const currentUser = await this.userQuery.findById(id)
    if (!currentUser) throw new Error('User not found')
    const tokenGenerator = new TokenGenerator(env.jwtSecret)
    token = tokenGenerator.generate({ id, username }, '7d')
    return {
      user: {
        username: currentUser.user.username,
        email: currentUser.user.email,
        bio: currentUser.user.bio,
        image: currentUser.user.image,
        token
      }
    }
  }
}
