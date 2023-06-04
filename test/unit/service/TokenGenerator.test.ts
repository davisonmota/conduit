import Email from '../../../src/domain/entity/Email'
import Name from '../../../src/domain/entity/Name'
import Password from '../../../src/domain/entity/Password'
import User from '../../../src/domain/entity/User'
import TokenGenerator from '../../../src/domain/service/TokenGenerator'
import EmailValidatorAdapter from '../../../src/infra/validator/EmailValidatorAdapter'

describe('TokenGenerator', () => {
  test('Deve criar um token', async () => {
    const tokenGenerator = new TokenGenerator('secret')
    const user = User.create(
      new Name('davison'),
      new Email('davison@gmail.com', new EmailValidatorAdapter()),
      await Password.create('plainPassword')
    )
    const token = tokenGenerator.generate(user, '1h', new Date('2023-05-04T14:00:00'))
    expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRhdmlzb24iLCJpYXQiOjE2ODMyMTk2MDAwMDAsImV4cCI6MTY4MzIxOTYwMzYwMH0.uVltzQ9DTiyFgj_j6T6kZEsBNgGueF97FxXz_trUvMc')
  })

  test('Deve validar o token', async () => {
    const tokenGenerator = new TokenGenerator('secret')
    const user = User.create(
      new Name('davison'),
      new Email('davison@gmail.com', new EmailValidatorAdapter()),
      await Password.create('plainPassword')
    )
    const token = tokenGenerator.generate(user, '1h', new Date('2023-05-04T14:00:00'))
    const payload = tokenGenerator.validate(token)
    expect(payload.username).toBe('davison')
  })
})
