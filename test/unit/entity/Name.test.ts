import Name from '../../../src/domain/entity/Name'

describe('Name', () => {
  test('Deve criar o username', () => {
    const name = new Name('username')
    expect(name.getValue()).toBe('username')
  })

  test('Deve validar o username', () => {
    expect(() => new Name('user name')).toThrow(new Error('Invalid username'))
  })
})
