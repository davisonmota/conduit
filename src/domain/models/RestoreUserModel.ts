import type Bio from '../entity/Bio'
import type Email from '../entity/Email'
import type ImageProfile from '../entity/ImageProfile'
import type Password from '../entity/Password'
import type Username from '../entity/Username'

export default interface RestoreUserModel {
  id: string
  email: Email
  username: Username
  password: Password
  bio: Bio
  image: ImageProfile
}
