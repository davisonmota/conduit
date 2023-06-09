import Username from '../../../src/domain/entity/Username'
import { InvalidParamError } from '../../../src/presentation/errors/InvalidParamError'

describe('Name', () => {
  test('Deve criar o username', () => {
    const name = new Username('username')
    expect(name.getValue()).toBe('username')
  })

  test('Deve validar o username', () => {
    expect(() => new Username('user name')).toThrow(new InvalidParamError('username'))
  })
})
