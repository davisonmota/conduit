import { sign, verify } from 'jsonwebtoken'
import type User from '../entity/User'

export default class TokenGenerator {
  constructor (private readonly key: string) {}

  generate (user: User, expiresIn: string | number, issueDate: Date = new Date()): string {
    return sign({ username: user.getUsername(), iat: issueDate.getTime() },
      this.key,
      { expiresIn, noTimestamp: false }
    )
  }

  async validate (token: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      verify(token, this.key, (err, decoded) => {
        if (err) reject(new Error('Invalid token'))
        resolve(decoded)
      })
    })
  }
}
