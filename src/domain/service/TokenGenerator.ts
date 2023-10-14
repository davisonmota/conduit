import { sign, verify } from 'jsonwebtoken'
import { InvalidTokenError } from '../../presentation/errors/InvalidTokenError'

export default class TokenGenerator {
  constructor (private readonly key: string) {}

  generate ({ username, id }: IdentityUser, expiresIn: string | number, issueDate: Date = new Date()): string {
    return sign({ username, id, iat: issueDate.getTime() },
      this.key,
      { expiresIn, noTimestamp: false }
    )
  }

  async validate (token: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      verify(token, this.key, (err, decoded) => {
        if (err) reject(new InvalidTokenError())
        resolve(decoded)
      })
    })
  }
}

type IdentityUser = {
  username: string
  id: string
}
