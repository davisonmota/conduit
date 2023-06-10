import { type UserQueryOutput } from '../../infra/query/UserQueryDatabase'

export default interface UserQuery {
  findById(id: string): Promise<UserQueryOutput | undefined>
}
