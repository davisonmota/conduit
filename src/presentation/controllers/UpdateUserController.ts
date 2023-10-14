import type UpdateUser from '../../application/useCase/UpdateUser'
import { ok } from '../errors/http-helpers'
import { type HttpRequest } from '../http/HttpRequest'
import { type HttpResponse } from '../http/HttpResponse'
import type Controller from './Controller'

export default class UpdateUserController implements Controller {
  constructor (readonly updateUserUseCase: UpdateUser) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const body = httpRequest.body
    const authorization = httpRequest.header.Authorization as string
    const token = authorization.split('Token ')[1]
    const updatedUser = await this.updateUserUseCase.execute(token, body.user)
    return ok(updatedUser)
  }
}
