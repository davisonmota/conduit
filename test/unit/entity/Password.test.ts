import Password from '../../../src/domain/entity/Password'

describe('Password', () => {
  test('Deve criar uma senha', async () => {
    const password = await Password.create('plainPassword')
    expect(password.getValue()).not.toBe('plainPassword')
    expect(password.getValue()).toBeTruthy()
  })

  test('Deve criar senha criptografada', async () => {
    const password = await Password.create('plainPassword')
    expect(password.getValue()).not.toBe('plainPassword')
    expect(password.getValue()).toBeTruthy()
  })

  test('Não deve criar senha com menos de 8 caracteres', async () => {
    const promise = Password.create('123456')
    await expect(promise).rejects.toThrow(new Error('Invalid password'))
  })

  test('Deve validar a senha criptografada com a senha aberta', async () => {
    const password = await Password.create('plainPassword')
    const match = await password.compare('plainPassword')
    expect(match).toBe(true)
    expect(password.getValue()).not.toBe('plainPassword')
  })

  test('Deve restaurar a senha criptografada', async () => {
    const password = await Password.create('plainPassword')
    const passwordHashed = password.getValue()
    const restorePassword = Password.restore(passwordHashed)
    expect(restorePassword).toEqual(password)
  })

  test('Não deve validar a senha criptografada com a senha aberta incorreta', async () => {
    const password = await Password.create('plainPassword')
    const match = await password.compare('incorrectPassword')
    expect(match).toBe(false)
    expect(password.getValue()).not.toBe('plainPassword')
  })
})
