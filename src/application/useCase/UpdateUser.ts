/* eslint-disable @typescript-eslint/no-unused-expressions */
import { type UpdateUserModel } from '../../domain/models/UpdateUserModel'
import TokenGenerator from '../../domain/service/TokenGenerator'
import env from '../../main/config/env'
import type UserRepository from '../repository/UserRepository'
import type CheckAuth from './CheckAuth'
import { type UserOutPut } from './dto/UserOutPut'

export default class UpdateUser {
  constructor (readonly userRepository: UserRepository, readonly checkAuth: CheckAuth) {}

  async execute (token: string, data: UpdateUserModel): Promise<UserOutPut> {
    const { username } = await this.checkAuth.execute(token)
    const user = await this.userRepository.loadByUsername(username)
    if (!user) throw new Error('User not found')
    await user.update(data)
    await this.userRepository.update(user)
    const tokenGenerator = new TokenGenerator(env.jwtSecret)
    const newToken = tokenGenerator.generate({ id: user.getId(), username: user.getUsername() }, '7d')
    return {
      user: {
        username: user.getUsername(),
        email: user.getEmail(),
        bio: user.getBio(),
        image: user.getImage(),
        token: newToken
      }
    }
  }
}
