import Email from '../../domain/entity/Email'
import Password from '../../domain/entity/Password'
import User from '../../domain/entity/User'
import Username from '../../domain/entity/Username'
import type VerifyExistUser from '../../domain/service/VerifyExistUser'
import EmailValidatorAdapter from '../../infra/validator/EmailValidatorAdapter'
import type UserRepository from '../repository/UserRepository'

export default class Signup {
  constructor (
    readonly userRepository: UserRepository,
    readonly verifyExistUser: VerifyExistUser
  ) {}

  async execute (input: Input): Promise<void> {
    await this.verifyExistUser.execute(input.email, input.username)
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
