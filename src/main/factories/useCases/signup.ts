import Signup from '../../../application/useCase/Signup'
import UserRepositoryDatabase from '../../../infra/repository/database/UserRepository'
import prisma from '../../database/client'

export const makeSignupUseCase = (): Signup => {
  const useRepository = new UserRepositoryDatabase(prisma)
  return new Signup(useRepository)
}
