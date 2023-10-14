import type UpdateUser from '../../application/useCase/UpdateUser'
import type VerifyExistUser from '../../domain/service/VerifyExistUser'
import { EmailInUserError } from '../errors/EmailInUserError'
import { InvalidParamError } from '../errors/InvalidParamError'
import { InvalidTokenError } from '../errors/InvalidTokenError'
import { MissingParamError } from '../errors/MissingParamError'
import { UsernameInUserError } from '../errors/UsernameInUserError'
import { badRequest, ok, serverError, unprocessableContent } from '../errors/http-helpers'
import { type HttpRequest } from '../http/HttpRequest'
import { type HttpResponse } from '../http/HttpResponse'
import type Controller from './Controller'

export default class UpdateUserController implements Controller {
  constructor (readonly updateUserUseCase: UpdateUser, readonly verifyExistUser: VerifyExistUser) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.header) return badRequest(new MissingParamError('Header'))
      const authorization = httpRequest.header.Authorization as string
      if (!authorization) return badRequest(new MissingParamError('Authorization'))
      const token = authorization.split('Token ')[1]
      if (!httpRequest.body) return badRequest(new MissingParamError('body'))
      const body = httpRequest.body
      if (!body.user) return badRequest(new MissingParamError('user'))
      const user = body.user
      if (Object.keys(user).length === 0) return badRequest(new MissingParamError('Empty user'))
      await this.verifyExistUser.execute(user.email, user.username)
      const updatedUser = await this.updateUserUseCase.execute(token, user)
      return ok(updatedUser)
    } catch (error) {
      if (error instanceof InvalidTokenError) return unprocessableContent(error)
      if (error instanceof InvalidParamError) return unprocessableContent(error)
      if (error instanceof UsernameInUserError) return unprocessableContent(error)
      if (error instanceof EmailInUserError) return unprocessableContent(error)
      return serverError()
    }
  }
}
