import { sign, verify } from 'jsonwebtoken'
import type User from '../entity/User'

export default class TokenGenerator {
  constructor (private readonly key: string) {}

  generate (user: User, expiresIn: string | number, issueDate: Date = new Date()): string {
    return sign({ username: user.getName(), iat: issueDate.getTime() },
      this.key,
      { expiresIn, noTimestamp: false }
    )
  }

  validate (token: string): any {
    return verify(token, this.key)
  }
}
