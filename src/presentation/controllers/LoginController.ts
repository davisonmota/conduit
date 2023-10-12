import type Login from '../../application/useCase/Login'
import { MissingParamError } from '../errors/MissingParamError'
import { badRequest, ok } from '../errors/http-helpers'
import { type HttpRequest } from '../http/HttpRequest'
import { type HttpResponse } from '../http/HttpResponse'
import type Controller from './Controller'

export default class LoginController implements Controller {
  constructor (readonly loginUseCase: Login) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    if (!body) return badRequest(new MissingParamError('body'))
    return ok({})
  }
}
