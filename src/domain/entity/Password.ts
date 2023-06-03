import type Compare from '../service/Compare'
import type Hash from '../service/Hash'

export default class Password {
  constructor (
    private readonly passwordHash: string,
    private readonly compareService: Compare
  ) {}

  static async create (plainPassword: string, hashService: Hash, compareService: Compare): Promise<Password> {
    if (plainPassword.length < 8) throw new Error('Invalid password')
    const passwordHash = await hashService.hash(plainPassword)
    return new Password(passwordHash, compareService)
  }

  static restore (passwordHash: string, compareService: Compare): Password {
    return new Password(passwordHash, compareService)
  }

  async validate (value: string): Promise<boolean> {
    const match = await this.compareService.compare(value, this.passwordHash)
    return match
  }

  getValue (): string {
    return this.passwordHash
  }
}
