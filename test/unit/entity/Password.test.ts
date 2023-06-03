import Password from '../../../src/domain/entity/Password'
import BcryptAdapter from '../../../src/infra/validator/BcryptAdapter'

const makeSut = async (): Promise<any> => {
  const bcryptAdapter = new BcryptAdapter()
  const password = await Password.create('plainPassword', bcryptAdapter, bcryptAdapter)
  return {
    password,
    bcryptAdapter
  }
}

describe('Password', () => {
  test('Deve criar uma senha', async () => {
    const { password } = await makeSut()
    expect(password.getValue()).toBeTruthy()
  })

  test('Deve criar senha criptografada', async () => {
    const bcryptAdapter = new BcryptAdapter()
    jest.spyOn(bcryptAdapter, 'hash').mockResolvedValueOnce('any_hash')
    const password = await Password.create('plainPassword', bcryptAdapter, bcryptAdapter)
    expect(password.getValue()).not.toBe('plainPassword')
    expect(password.getValue()).toBe('any_hash')
  })

  test('Deve validar a senha criptografada com a senha aberta', async () => {
    const bcryptAdapter = new BcryptAdapter()
    const password = await Password.create('plainPassword', bcryptAdapter, bcryptAdapter)
    const match = await password.validate('plainPassword')
    expect(match).toBe(true)
    expect(password.getValue()).not.toBe('plainPassword')
  })
})
