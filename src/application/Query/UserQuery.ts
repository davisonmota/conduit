import { type UserOutPut } from '../useCase/dto/UserOutPut'

export default interface UserQuery {
  findById(id: string): Promise<Omit<UserOutPut, 'token'> | undefined>
}
