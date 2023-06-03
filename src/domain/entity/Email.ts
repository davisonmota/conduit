import type EmailValidator from '../service/EmailValidator'

export default class Email {
  constructor (readonly value: string, readonly validator: EmailValidator) {
  }

  getValue (): string {
    return this.value
  }
}
