import CheckAuth from '../../../application/useCase/CheckAuth'
import UpdateUser from '../../../application/useCase/UpdateUser'
import UserRepositoryDatabase from '../../../infra/repository/database/UserRepository'
import prisma from '../../database/client'

export const makeUpdateUserUseCase = (): UpdateUser => {
  const useRepository = new UserRepositoryDatabase(prisma)
  const checkAuth = new CheckAuth()
  return new UpdateUser(useRepository, checkAuth)
}
