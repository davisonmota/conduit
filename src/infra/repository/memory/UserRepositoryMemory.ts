import type EmailQuery from '../../../application/query/EmailQuery'
import type UsernameQuery from '../../../application/query/UsernameQuery'
import type UserRepository from '../../../application/repository/UserRepository'
import type User from '../../../domain/entity/User'

export default class UserRepositoryMemory implements UserRepository, UsernameQuery, EmailQuery {
  readonly users: User[]

  constructor () {
    this.users = []
  }

  async loadByEmail (value: string): Promise<User> {
    const user = this.users.find(user => user.getEmail() === value)
    if (!user) throw new Error('User not found')
    return user
  }

  async findEmail (value: string): Promise<boolean> {
    const exist = this.users.find(user => user.getEmail() === value)
    return !!exist
  }

  async save (user: User): Promise<void> {
    this.users.push(user)
  }

  async findUsername (value: string): Promise<boolean> {
    return !!this.users.find(user => user.getUsername() === value)
  }
}
