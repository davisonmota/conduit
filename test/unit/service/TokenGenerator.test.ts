import Email from '../../../src/domain/entity/Email'
import Password from '../../../src/domain/entity/Password'
import User from '../../../src/domain/entity/User'
import EmailValidatorAdapter from '../../../src/infra/validator/EmailValidatorAdapter'
import Username from '../../../src/domain/entity/Username'
import TokenGenerator from '../../../src/domain/service/TokenGenerator'

describe('TokenGenerator', () => {
  test('Deve criar um token', async () => {
    const tokenGenerator = new TokenGenerator('secret')
    const user = User.create({
      username: new Username('davison'),
      email: new Email('davison@gmail.com', new EmailValidatorAdapter()),
      password: await Password.create('plainPassword')
    })
    const token = tokenGenerator.generate(user, '1h', new Date('2023-05-04T14:00:00'))
    expect(token).toBeTruthy()
  })

  test('Deve validar o token', async () => {
    const tokenGenerator = new TokenGenerator('secret')
    const user = User.create({
      username: new Username('davison'),
      email: new Email('davison@gmail.com', new EmailValidatorAdapter()),
      password: await Password.create('plainPassword')
    })
    const token = tokenGenerator.generate(user, '1h', new Date('2023-05-04T14:00:00'))
    const payload = await tokenGenerator.validate(token)
    expect(payload.username).toBe('davison')
    expect(payload.id).toBeTruthy()
  })

  test('Deve lançar erro se o verificação do token falhar', async () => {
    const tokenGenerator = new TokenGenerator('secret')
    const user = User.create({
      username: new Username('davison'),
      email: new Email('davison@gmail.com', new EmailValidatorAdapter()),
      password: await Password.create('plainPassword')
    })
    const token = tokenGenerator.generate(user, '1h', new Date('2023-05-04T14:00:00'))
    const payload = tokenGenerator.validate(`${token}invalid`)
    await expect(payload).rejects.toThrow(new Error('Invalid token'))
  })
})
