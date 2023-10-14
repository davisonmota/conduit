import Signup from '../../../application/useCase/Signup'
import VerifyExistUser from '../../../domain/service/VerifyExistUser'
import UserRepositoryDatabase from '../../../infra/repository/database/UserRepository'
import prisma from '../../database/client'

export const makeSignupUseCase = (): Signup => {
  const userRepository = new UserRepositoryDatabase(prisma)
  const verifyExistUser = new VerifyExistUser(userRepository)
  return new Signup(userRepository, verifyExistUser)
}
