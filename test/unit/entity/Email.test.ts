import Email from '../../../src/domain/entity/Email'
import EmailValidatorAdapter from '../../../src/infra/validator/EmailValidatorAdapter'

describe('Email', () => {
  test('Deve criar email', () => {
    const emailValidator = new EmailValidatorAdapter()
    const email = new Email('any_email@gmail.com', emailValidator)
    expect(email.getValue()).toBe('any_email@gmail.com')
  })

  test('Deve lançar erro se o email for inválido', () => {
    const emailValidator = new EmailValidatorAdapter()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)
    expect(() => new Email('invalid_email@gmail.com', emailValidator))
      .toThrow(new Error('Invalid email'))
  })
})
