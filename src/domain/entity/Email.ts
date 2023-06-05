import type EmailValidator from '../service/EmailValidator'

export default class Email {
  private readonly value: string

  constructor (value: string, validator: EmailValidator) {
    if (!validator.isValid(value)) throw new Error('Invalid email')
    this.value = value
  }

  getValue (): string {
    return this.value
  }
}
