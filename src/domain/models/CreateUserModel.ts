import type Email from '../entity/Email'
import type Password from '../entity/Password'
import type Username from '../entity/Username'

export default interface CreateUserModel {
  email: Email
  username: Username
  password: Password
}
