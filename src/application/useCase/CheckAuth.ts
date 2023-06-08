import TokenGenerator from '../../domain/service/TokenGenerator'
import env from '../../main/config/env'

export default class CheckAuth {
  async execute (token: string): Promise<PayloadOutPut> {
    const tokenGenerator = new TokenGenerator(env.jwtSecret)
    const payload = await tokenGenerator.validate(token)
    return {
      username: payload.username,
      id: payload.id
    }
  }
}

type PayloadOutPut = {
  username: string
  id: string
}
