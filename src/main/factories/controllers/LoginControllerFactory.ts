import type Controller from '../../../presentation/controllers/Controller'
import LoginController from '../../../presentation/controllers/LoginController'
import { makeLoginUseCase } from '../useCases/login'

export const makeLoginController = (): Controller => {
  return new LoginController(makeLoginUseCase())
}
