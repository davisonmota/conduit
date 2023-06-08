import TokenGenerator from '../../domain/service/TokenGenerator'
import type UserRepository from '../repository/UserRepository'
import env from '../../main/config/env'

export default class Login {
  constructor (readonly userRepository: UserRepository) {}

  async execute (input: Input): Promise<UserOutPut> {
    const user = await this.userRepository.loadByEmail(input.email)
    if (!(user && await user.validatePassword(input.password))) {
      throw new Error('Authentication fails')
    }
    const tokenGenerator = new TokenGenerator(env.jwtSecret)
    const token = tokenGenerator.generate(user, '7d')
    return {
      username: user.getUsername(),
      email: user.getEmail(),
      bio: user.getBio(),
      image: user.getImage(),
      token
    }
  }
}

type Input = {
  email: string
  password: string
}

export type UserOutPut = {
  username: string
  email: string
  token: string
  bio: string
  image: string
}
