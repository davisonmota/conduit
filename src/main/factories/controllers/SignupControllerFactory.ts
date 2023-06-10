import type Controller from '../../../presentation/controllers/Controller'
import SignupController from '../../../presentation/controllers/SignupController'
import { makeLoginUseCase } from '../useCases/login'
import { makeSignupUseCase } from '../useCases/signup'

export const makeSignupController = (): Controller => {
  return new SignupController(makeSignupUseCase(), makeLoginUseCase())
}
