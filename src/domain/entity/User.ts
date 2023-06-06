import type CreateUserModel from '../models/CreateUserModel'
import type RestoreUserModel from '../models/RestoreUserModel'
import type UserModel from '../models/UserModel'
import Bio from './Bio'
import ImageProfile from './ImageProfile'

export default class User {
  private constructor (private readonly data: UserModel) { }

  static create ({ email, password, username }: CreateUserModel): User {
    return new User({ email, password, username, bio: new Bio(''), image: new ImageProfile('') })
  }

  static restore (userData: RestoreUserModel): User {
    return new User(userData)
  }

  getUsername (): string {
    return this.data.username.getValue()
  }

  getEmail (): string {
    return this.data.email.getValue()
  }

  getPassword (): string {
    return this.data.password.getValue()
  }

  getBio (): string {
    return this.data.bio.getValue()
  }

  getImage (): string {
    return this.data.image.getValue()
  }

  async validatePassword (value: string): Promise<boolean> {
    return await this.data.password.validate(value)
  }
}
