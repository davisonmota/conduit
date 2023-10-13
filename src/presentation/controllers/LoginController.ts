import type Login from '../../application/useCase/Login'
import { InvalidCredentials } from '../errors/InvalidCredentials'
import { MissingParamError } from '../errors/MissingParamError'
import { badRequest, ok, serverError, unprocessableContent } from '../errors/http-helpers'
import { type HttpRequest } from '../http/HttpRequest'
import { type HttpResponse } from '../http/HttpResponse'
import type Controller from './Controller'

export default class LoginController implements Controller {
  constructor (readonly loginUseCase: Login) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredField = ['email', 'password']
      const { body } = httpRequest
      if (!body?.user) return badRequest(new MissingParamError('user'))
      for (const field of requiredField) {
        if (!body.user[field]) return badRequest(new MissingParamError(`${field}`))
      }
      const { email, password } = body.user
      const user = await this.loginUseCase.execute({ email, password })
      return ok(user)
    } catch (error) {
      if (error instanceof InvalidCredentials) return unprocessableContent(error)
      return serverError()
    }
  }
}
