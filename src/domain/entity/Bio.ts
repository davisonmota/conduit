import { InvalidParamError } from '../../presentation/errors/InvalidParamError'
import { Property } from './Property'

export default class Bio extends Property {
  private value: string
  constructor (value: string) {
    Bio.validate(value)
    super()
    this.value = value
  }

  static validate (value: string): void {
    if (value.length > 255) throw new InvalidParamError('bio')
  }

  getValue (): string {
    return this.value
  }

  update (value: string): void {
    Bio.validate(value)
    this.value = value
  }
}
