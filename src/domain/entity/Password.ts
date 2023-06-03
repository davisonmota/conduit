import type Compare from '../service/Compare'
import type Hash from '../service/Hash'

export default class Password {
  constructor (
    private readonly passwordHash: string,
    readonly hashService: Hash,
    readonly compareService: Compare
  ) {}

  static async create (plainPassword: string, hashService: Hash, compareService: Compare): Promise<Password> {
    const passwordHash = await hashService.hash(plainPassword)
    return new Password(passwordHash, hashService, compareService)
  }

  async validate (value: string): Promise<boolean> {
    const match = await this.compareService.compare(value, this.passwordHash)
    return match
  }

  getValue (): string {
    return this.passwordHash
  }
}
