import type Login from '../../application/useCase/Login'
import type Signup from '../../application/useCase/Signup'
import { MissingParamError } from '../errors/MissingParamError'
import { badRequest } from '../errors/http-helpers'
import { type HttpRequest } from '../http/HttpRequest'
import { type HttpResponse } from '../http/HttpResponse'

export default class SignupController {
  constructor (readonly signupUseCase: Signup, readonly loginUseCase: Login) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body
    try {
      if (!email) return badRequest(new MissingParamError('email'))
    } catch (error) {

    }
    return await Promise.resolve({ statusCode: 200, body: '' })
  }
}
