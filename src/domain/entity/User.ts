import type Email from './Email'
import type Name from './Name'
import type Password from './Password'

export default class User {
  private constructor (
    private readonly name: Name,
    private readonly email: Email,
    private readonly password: Password
  ) {}

  static create (
    name: Name,
    email: Email,
    password: Password
  ): User {
    return new User(name, email, password)
  }

  getName (): string {
    return this.name.getValue()
  }

  getEmail (): string {
    return this.email.getValue()
  }

  async validatePassword (plainPassword: string): Promise<boolean> {
    return await this.password.validate(plainPassword)
  }
}
