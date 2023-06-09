import type Login from '../../application/useCase/Login'
import type Signup from '../../application/useCase/Signup'
import { MissingParamError } from '../errors/MissingParamError'
import { badRequest } from '../errors/http-helpers'
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
      return await Promise.resolve({ statusCode: 200, body: '' })
    } catch (error) {
      return await Promise.resolve({ statusCode: 500, body: '' })
    }
  }
}
