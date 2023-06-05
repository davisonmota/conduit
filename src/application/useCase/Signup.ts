import Email from '../../domain/entity/Email'
import Password from '../../domain/entity/Password'
import User from '../../domain/entity/User'
import Name from '../../domain/entity/Username'
import EmailValidatorAdapter from '../../infra/validator/EmailValidatorAdapter'
import type UserRepository from '../repository/UserRepository'

export default class Signup {
  constructor (
    readonly userRepository: UserRepository
  ) {}

  async execute (input: Input): Promise<void> {
    let existUser = await this.userRepository.loadByEmail(input.email)
    if (existUser) throw new Error('Email already in use')
    existUser = await this.userRepository.loadByUsername(input.username)
    if (existUser) throw new Error('Username already exist')
    const user = User.create(
      new Name(input.username),
      new Email(input.email, new EmailValidatorAdapter()),
      await Password.create(input.password)
    )
    await this.userRepository.save(user)
  }
}

type Input = {
  username: string
  email: string
  password: string
}
