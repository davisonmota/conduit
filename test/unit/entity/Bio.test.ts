import Bio from '../../../src/domain/entity/Bio'
import { InvalidParamError } from '../../../src/presentation/errors/InvalidParamError'

describe('Bio', () => {
  test('Deve criar a bio', () => {
    const bio = new Bio('I love conduit')
    expect(bio.getValue()).toBe('I love conduit')
  })

  test('Não deve criar bio com mais de 255 caracteres', () => {
    expect(() => new Bio("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.  Lorem Ipsum."))
      .toThrow(new InvalidParamError('bio'))
  })
})
