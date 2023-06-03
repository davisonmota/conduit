import Email from '../../../src/domain/entity/Email'
import Name from '../../../src/domain/entity/Name'
import Password from '../../../src/domain/entity/Password'
import User from '../../../src/domain/entity/User'
import BcryptAdapter from '../../../src/infra/validator/BcryptAdapter'
import EmailValidatorAdapter from '../../../src/infra/validator/EmailValidatorAdapter'

describe('User', () => {
  test('Deve criar um usuário', async () => {
    const emailValidator = new EmailValidatorAdapter()
    const bcryptAdapter = new BcryptAdapter()
    const user = User.create(
      new Name('username'),
      new Email('user@gmail.com', emailValidator),
      await Password.create('plainPassword', bcryptAdapter, bcryptAdapter)
    )
    expect(user.getName()).toBe('username')
    expect(user.getEmail()).toBe('user@gmail.com')
    expect(await user.validatePassword('plainPassword')).toBe(true)
  })
})
