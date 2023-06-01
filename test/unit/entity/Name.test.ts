import Name from '../../../src/domain/entity/Name'

describe('Name', () => {
  test('Deve criar o username', () => {
    const name = new Name('username')
    expect(name.getValue()).toBe('username')
  })
})
