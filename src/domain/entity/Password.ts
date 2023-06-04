import { hash, compare } from 'bcrypt'
export default class Password {
  private constructor (
    private readonly passwordHash: string
  ) {}

  static async create (plainPassword: string): Promise<Password> {
    if (plainPassword.length < 8) throw new Error('Invalid password')
    const salt = 10
    const passwordHash = await hash(plainPassword, salt)
    return new Password(passwordHash)
  }

  static restore (passwordHash: string): Password {
    return new Password(passwordHash)
  }

  async validate (value: string): Promise<boolean> {
    const match = await compare(value, this.passwordHash)
    return match
  }

  getValue (): string {
    return this.passwordHash
  }
}
