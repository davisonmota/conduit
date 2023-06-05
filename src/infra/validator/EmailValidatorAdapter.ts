import type EmailValidator from '../../domain/service/EmailValidator'
import validator from 'validator'

export default class EmailValidatorAdapter implements EmailValidator {
  isValid (value: string): boolean {
    return validator.isEmail(value)
  }
}
