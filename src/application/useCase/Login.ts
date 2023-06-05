import TokenGenerator from '../../domain/service/TokenGenerator'
import type UserRepository from '../repository/UserRepository'
import env from '../../main/config/env'

export default class Login {
  constructor (readonly userRepository: UserRepository) {}

  async execute (input: Input): Promise<OutPut> {
    const user = await this.userRepository.loadByEmail(input.email)
    if (!(user && await user.validatePassword(input.password))) {
      throw new Error('Authentication fails')
    }
    const tokenGenerator = new TokenGenerator(env.jwtSecret)
    const token = tokenGenerator.generate(user, '7d')
    return {
      username: user.getUsername(),
      email: user.getEmail(),
      token
    }
  }
}

type Input = {
  email: string
  password: string
}

type OutPut = {
  username: string
  email: string
  token: string
  bio?: string
  image?: string
}
