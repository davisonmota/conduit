import type User from '../../domain/entity/User'

export default interface UserRepository {
  save(user: User): Promise<void>
  loadByEmail(email: string): Promise<User | undefined>
  loadByUsername(username: string): Promise<User | undefined>
}
