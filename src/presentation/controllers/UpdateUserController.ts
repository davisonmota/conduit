import type UpdateUser from '../../application/useCase/UpdateUser'
import { InvalidTokenError } from '../errors/InvalidTokenError'
import { ok, serverError, unprocessableContent } from '../errors/http-helpers'
import { type HttpRequest } from '../http/HttpRequest'
import { type HttpResponse } from '../http/HttpResponse'
import type Controller from './Controller'

export default class UpdateUserController implements Controller {
  constructor (readonly updateUserUseCase: UpdateUser) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const body = httpRequest.body
      const authorization = httpRequest.header.Authorization as string
      const token = authorization.split('Token ')[1]
      const updatedUser = await this.updateUserUseCase.execute(token, body.user)
      return ok(updatedUser)
    } catch (error) {
      if (error instanceof InvalidTokenError) return unprocessableContent(error)
      return serverError()
    }
  }
}
