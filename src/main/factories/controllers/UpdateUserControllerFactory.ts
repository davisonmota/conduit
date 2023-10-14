import VerifyExistUser from '../../../domain/service/VerifyExistUser'
import UserRepositoryDatabase from '../../../infra/repository/database/UserRepository'
import type Controller from '../../../presentation/controllers/Controller'
import UpdateUserController from '../../../presentation/controllers/UpdateUserController'
import prisma from '../../database/client'
import { makeUpdateUserUseCase } from '../useCases/updateUser'

export const makeUpdateUserController = (): Controller => {
  const userRepository = new UserRepositoryDatabase(prisma)
  const verifyExistUser = new VerifyExistUser(userRepository)
  return new UpdateUserController(makeUpdateUserUseCase(), verifyExistUser)
}
