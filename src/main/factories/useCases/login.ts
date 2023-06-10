import Login from '../../../application/useCase/Login'
import UserRepositoryDatabase from '../../../infra/repository/database/UserRepository'
import prisma from '../../database/client'

export const makeLoginUseCase = (): Login => {
  const useRepository = new UserRepositoryDatabase(prisma)
  return new Login(useRepository)
}
