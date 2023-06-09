import Email from '../../domain/entity/Email'
import Password from '../../domain/entity/Password'
import User from '../../domain/entity/User'
import Username from '../../domain/entity/Username'
import EmailValidatorAdapter from '../../infra/validator/EmailValidatorAdapter'
import { EmailInUserError } from '../../presentation/errors/EmailInUserError'
import { UsernameInUserError } from '../../presentation/errors/UsernameInUserError'
import type UserRepository from '../repository/UserRepository'

export default class Signup {
  constructor (
    readonly userRepository: UserRepository
  ) {}

  async execute (input: Input): Promise<void> {
    let existUser = await this.userRepository.loadByEmail(input.email)
    if (existUser) throw new EmailInUserError()
    existUser = await this.userRepository.loadByUsername(input.username)
    if (existUser) throw new UsernameInUserError()
    const user = User.create({
      username: new Username(input.username),
      email: new Email(input.email, new EmailValidatorAdapter()),
      password: await Password.create(input.password)
    })
    await this.userRepository.save(user)
  }
}

type Input = {
  username: string
  email: string
  password: string
}
