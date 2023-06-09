import { InvalidParamError } from '../../presentation/errors/InvalidParamError'
import type EmailValidator from '../service/EmailValidator'
import { Property } from './Property'

export default class Email extends Property {
  private value: string
  readonly emailValidator: EmailValidator

  constructor (value: string, emailValidator: EmailValidator) {
    Email.validate(value, emailValidator)
    super()
    this.value = value
    this.emailValidator = emailValidator
  }

  static validate (value: string, validator: EmailValidator): void {
    if (!validator.isValid(value)) throw new InvalidParamError('email')
  }

  update (value: string): void {
    Email.validate(value, this.emailValidator)
    this.value = value
  }

  getValue (): string {
    return this.value
  }
}
