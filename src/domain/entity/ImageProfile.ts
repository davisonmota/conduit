import { InvalidParamError } from '../../presentation/errors/InvalidParamError'
import { Property } from './Property'

export default class ImageProfile extends Property {
  private url: string

  constructor (url: string) {
    ImageProfile.validate(url)
    super()
    this.url = url
  }

  static validate (value: string): void {
    if (value && !value.match('^(https?|ftp)://[^s/$.?#].[^s]*$')) {
      throw new InvalidParamError('url image profile')
    }
  }

  update (value: string): void {
    ImageProfile.validate(value)
    this.url = value
  }

  getValue (): string {
    return this.url
  }
}
