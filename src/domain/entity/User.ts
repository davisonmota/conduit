import type Email from './Email'
import type Username from './Username'
import type Password from './Password'

export default class User {
  private constructor (
    private readonly username: Username,
    private readonly email: Email,
    private readonly password: Password
  ) {}

  static create (
    username: Username,
    email: Email,
    password: Password
  ): User {
    return new User(username, email, password)
  }

  getUsername (): string {
    return this.username.getValue()
  }

  getEmail (): string {
    return this.email.getValue()
  }

  async validatePassword (value: string): Promise<boolean> {
    return await this.password.validate(value)
  }
}
