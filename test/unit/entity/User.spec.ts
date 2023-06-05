import Email from '../../../src/domain/entity/Email'
import Name from '../../../src/domain/entity/Username'
import Password from '../../../src/domain/entity/Password'
import User from '../../../src/domain/entity/User'
import EmailValidatorAdapter from '../../../src/infra/validator/EmailValidatorAdapter'

describe('User', () => {
  test('Deve criar um usuário', async () => {
    const emailValidator = new EmailValidatorAdapter()
    const user = User.create(
      new Name('username'),
      new Email('user@gmail.com', emailValidator),
      await Password.create('plainPassword')
    )
    expect(user.getUsername()).toBe('username')
    expect(user.getEmail()).toBe('user@gmail.com')
    expect(await user.validatePassword('plainPassword')).toBe(true)
  })
})
