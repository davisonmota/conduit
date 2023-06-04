import { sign } from 'jsonwebtoken'
import type User from '../entity/User'

export default class TokenGenerator {
  constructor (private readonly key: string) {}

  generate (user: User, expiresIn: string, issueDate: Date = new Date()): string {
    return sign({ username: user.getName(), iat: issueDate.getTime() },
      this.key,
      { expiresIn, noTimestamp: false }
    )
  }
}
