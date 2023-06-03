import type Hash from '../service/Hash'

export default class Password {
  constructor (private readonly passwordHash: string, readonly hashService: Hash) {}

  static async create (plainPassword: string, hashService: Hash): Promise<Password> {
    const passwordHash = await hashService.hash(plainPassword)
    return new Password(passwordHash, hashService)
  }

  getValue (): string {
    return this.passwordHash
  }
}
