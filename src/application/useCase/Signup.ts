import Email from '../../domain/entity/Email'
import Name from '../../domain/entity/Username'
import Password from '../../domain/entity/Password'
import User from '../../domain/entity/User'
import EmailValidatorAdapter from '../../infra/validator/EmailValidatorAdapter'
import type EmailQuery from '../query/EmailQuery'
import type UsernameQuery from '../query/UsernameQuery'
import type UserRepository from '../repository/UserRepository'

export default class Signup {
  constructor (
    readonly userRepository: UserRepository,
    readonly usernameQuery: UsernameQuery,
    readonly emailQuery: EmailQuery
  ) {}

  async execute (input: Input): Promise<void> {
    const existUsername = await this.usernameQuery.findUsername(input.username)
    if (existUsername) throw new Error('Username already exist')
    const existEmail = await this.emailQuery.findEmail(input.email)
    if (existEmail) throw new Error('Email already in use')
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
