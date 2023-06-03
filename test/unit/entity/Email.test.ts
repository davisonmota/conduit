import Email from '../../../src/domain/entity/Email'
import type EmailValidator from '../../../src/domain/service/EmailValidator'
import EmailValidatorAdapter from '../../../src/infra/validator/EmailValidatorAdapter'

const makeSut = (): { email: Email, emailValidator: EmailValidator } => {
  const emailValidator = new EmailValidatorAdapter()
  const email = new Email('any_email@gmail.com', emailValidator)
  return {
    email,
    emailValidator
  }
}

describe('Email', () => {
  test('Deve criar email', () => {
    const { email } = makeSut()
    expect(email.getValue()).toBe('any_email@gmail.com')
  })
})
