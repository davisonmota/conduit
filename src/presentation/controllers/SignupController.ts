import type Login from '../../application/useCase/Login'
import type Signup from '../../application/useCase/Signup'
import { EmailInUserError } from '../errors/EmailInUserError'
import { InvalidParamError } from '../errors/InvalidParamError'
import { MissingParamError } from '../errors/MissingParamError'
import { UsernameInUserError } from '../errors/UsernameInUserError'
import { badRequest, created, serverError, unprocessableContent } from '../errors/http-helpers'
import { type HttpRequest } from '../http/HttpRequest'
import { type HttpResponse } from '../http/HttpResponse'
import type Controller from './Controller'

export default class SignupController implements Controller {
  constructor (readonly signupUseCase: Signup, readonly loginUseCase: Login) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredField = ['email', 'username', 'password']
    const body = httpRequest.body
    try {
      if (!body) return badRequest(new MissingParamError('body'))
      for (const field of requiredField) {
        if (!body.user[field]) return badRequest(new MissingParamError(`${field}`))
      }
      const { email, username, password } = body.user
      await this.signupUseCase.execute({ email, username, password })
      const user = await this.loginUseCase.execute({ email, password })
      return created(user)
    } catch (error) {
      if (error instanceof EmailInUserError) return badRequest(error)
      if (error instanceof UsernameInUserError) return badRequest(error)
      if (error instanceof InvalidParamError) return unprocessableContent(error)
      return serverError()
    }
  }
}
