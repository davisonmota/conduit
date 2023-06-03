import type Hash from '../../domain/service/Hash'
import { hash } from 'bcrypt'

export default class BcryptAdapter implements Hash {
  async hash (value: string): Promise<string> {
    const salt = 12
    const passwordHashed = await hash(value, salt)
    return passwordHashed
  }
}
