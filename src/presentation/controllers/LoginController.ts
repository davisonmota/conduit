import type Login from '../../application/useCase/Login'
import { MissingParamError } from '../errors/MissingParamError'
import { badRequest, ok } from '../errors/http-helpers'
import { type HttpRequest } from '../http/HttpRequest'
import { type HttpResponse } from '../http/HttpResponse'
import type Controller from './Controller'

export default class LoginController implements Controller {
  constructor (readonly loginUseCase: Login) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredField = ['email']
    const { body } = httpRequest
    if (!body) return badRequest(new MissingParamError('body'))
    for (const field of requiredField) {
      if (!body.user[field]) return badRequest(new MissingParamError(`${field}`))
    }
    return ok({})
  }
}
