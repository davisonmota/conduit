import Username from '../../../src/domain/entity/Username'

describe('Name', () => {
  test('Deve criar o username', () => {
    const name = new Username('username')
    expect(name.getValue()).toBe('username')
  })

  test('Deve validar o username', () => {
    expect(() => new Username('user name')).toThrow(new Error('Invalid username'))
  })
})
