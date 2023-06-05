import { hash, compare } from 'bcrypt'
export default class Password {
  private constructor (
    private readonly hash: string
  ) {}

  static async create (plainPassword: string): Promise<Password> {
    if (plainPassword.length < 8) throw new Error('Invalid password')
    const salt = 10
    const hashed = await hash(plainPassword, salt)
    return new Password(hashed)
  }

  static restore (hash: string): Password {
    return new Password(hash)
  }

  async validate (value: string): Promise<boolean> {
    const match = await compare(value, this.hash)
    return match
  }

  getValue (): string {
    return this.hash
  }
}
