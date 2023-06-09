import type Login from '../../application/useCase/Login'
import type Signup from '../../application/useCase/Signup'
import { EmailInUserError } from '../errors/EmailInUserError'
import { InvalidParamError } from '../errors/InvalidParamError'
import { MissingParamError } from '../errors/MissingParamError'
import { UsernameInUserError } from '../errors/UsernameInUserError'
import { badRequest, serverError, unprocessableContent } from '../errors/http-helpers'
import { type HttpRequest } from '../http/HttpRequest'
import { type HttpResponse } from '../http/HttpResponse'

export default class SignupController {
  constructor (readonly signupUseCase: Signup, readonly loginUseCase: Login) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredField = ['email', 'username', 'password']
    const body = httpRequest.body
    try {
      if (!body) return badRequest(new MissingParamError('body'))
      for (const field of requiredField) {
        if (!body[field]) return badRequest(new MissingParamError(`${field}`))
      }
      const { email, username, password } = body
      await this.signupUseCase.execute({ email, username, password })
      await this.loginUseCase.execute({ email, password })
      return await Promise.resolve({ statusCode: 200, body: '' })
    } catch (error) {
      if (error instanceof EmailInUserError) return badRequest(error)
      if (error instanceof UsernameInUserError) return badRequest(error)
      if (error instanceof InvalidParamError) return unprocessableContent(error)
      return serverError()
    }
  }
}
