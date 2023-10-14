import type UserRepository from '../../application/repository/UserRepository'
import { EmailInUserError } from '../../presentation/errors/EmailInUserError'
import { UsernameInUserError } from '../../presentation/errors/UsernameInUserError'

export default class VerifyExistUser {
  constructor (readonly userRepository: UserRepository) {}

  async execute (email: string, username: string): Promise<void> {
    if (email) {
      const existUser = await this.userRepository.loadByEmail(email)
      if (existUser) throw new EmailInUserError()
    }
    if (username) {
      const existUser = await this.userRepository.loadByUsername(username)
      if (existUser) throw new UsernameInUserError()
    }
  }
}
