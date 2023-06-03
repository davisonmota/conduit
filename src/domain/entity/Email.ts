import type EmailValidator from '../service/EmailValidator'

export default class Email {
  constructor (readonly value: string, readonly validator: EmailValidator) {
    if (!this.validator.isValid(this.value)) throw new Error('Invalid email')
  }

  getValue (): string {
    return this.value
  }
}
