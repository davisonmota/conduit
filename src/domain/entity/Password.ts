import { hash, compare } from 'bcrypt'
import { Property } from './Property'
import { InvalidParamError } from '../../presentation/errors/InvalidParamError'
export default class Password extends Property {
  private hash: string

  private constructor (hash: string) {
    super()
    this.hash = hash
  }

  static validate (value: string): void {
    if (value.length < 8) throw new InvalidParamError('password')
  }

  static async create (plainPassword: string): Promise<Password> {
    Password.validate(plainPassword)
    const salt = 10
    const hashed = await hash(plainPassword, salt)
    return new Password(hashed)
  }

  static restore (hash: string): Password {
    return new Password(hash)
  }

  async compare (value: string): Promise<boolean> {
    const match = await compare(value, this.hash)
    return match
  }

  async update (value: string): Promise<void> {
    Password.validate(value)
    const salt = 10
    this.hash = await hash(value, salt)
  }

  getValue (): string {
    return this.hash
  }
}
