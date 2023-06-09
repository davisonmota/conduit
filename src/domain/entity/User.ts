import type CreateUserModel from '../models/CreateUserModel'
import { type UpdateUserModel } from '../models/UpdateUserModel'
import ImageProfile from './ImageProfile'
import type UserModel from '../models/UserModel'
import Bio from './Bio'
import { v4 as uuid } from 'uuid'
import { InvalidParamError } from '../../presentation/errors/InvalidParamError'
export default class User {
  private constructor (private readonly data: UserModel) { }

  static create ({ email, password, username }: CreateUserModel): User {
    return new User({ id: uuid(), email, password, username, bio: new Bio(''), image: new ImageProfile('') })
  }

  static restore (userData: UserModel): User {
    return new User(userData)
  }

  async update (data: UpdateUserModel): Promise<void> {
    const validUpdateProperty = ['email', 'password', 'username', 'bio', 'image']
    for (const property in data) {
      if (!validUpdateProperty.includes(property)) throw new InvalidParamError(property)
      if (property !== 'id') await this.data[property].update(data[property])
    }
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

  getId (): string {
    return this.data.id
  }

  async validatePassword (value: string): Promise<boolean> {
    const isValid = await this.data.password.compare(value)
    return isValid
  }
}
