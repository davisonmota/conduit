import Password from '../../../src/domain/entity/Password'

const makeSut = async (): Promise<any> => {
  const password = await Password.create('plainPassword')
  return {
    password
  }
}

describe('Password', () => {
  test('Deve criar uma senha', async () => {
    const { password } = await makeSut()
    expect(password.getValue()).toBeTruthy()
  })
})
