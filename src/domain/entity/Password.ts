export default class Password {
  constructor (private readonly password: string) {}

  static async create (plainPassword: string): Promise<Password> {
    return new Password(plainPassword)
  }

  getValue (): string {
    return this.password
  }
}
