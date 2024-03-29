import TokenGenerator from '../../domain/service/TokenGenerator'
import type UserRepository from '../repository/UserRepository'
import env from '../../main/config/env'
import { type UserOutPut } from './dto/UserOutPut'
import { InvalidCredentials } from '../../presentation/errors/InvalidCredentials'

export default class Login {
  constructor (readonly userRepository: UserRepository) {}

  async execute (input: Input): Promise<UserOutPut> {
    const user = await this.userRepository.loadByEmail(input.email)
    if (!(user && await user.validatePassword(input.password))) {
      throw new InvalidCredentials()
    }
    const tokenGenerator = new TokenGenerator(env.jwtSecret)
    const token = tokenGenerator.generate({ id: user.getId(), username: user.getUsername() }, '7d')
    return {
      user: {
        username: user.getUsername(),
        email: user.getEmail(),
        bio: user.getBio(),
        image: user.getImage(),
        token
      }
    }
  }
}

type Input = {
  email: string
  password: string
}
