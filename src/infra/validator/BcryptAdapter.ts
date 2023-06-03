import type Compare from '../../domain/service/Compare'
import type Hash from '../../domain/service/Hash'
import { compare, hash } from 'bcrypt'

export default class BcryptAdapter implements Hash, Compare {
  async hash (value: string): Promise<string> {
    const salt = 12
    const passwordHashed = await hash(value, salt)
    return passwordHashed
  }

  async compare (plainPassword: string, passwordHash: string): Promise<boolean> {
    const match = await compare(plainPassword, passwordHash)
    return match
  }
}
