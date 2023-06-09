import ImageProfile from '../../../src/domain/entity/ImageProfile'
import { InvalidParamError } from '../../../src/presentation/errors/InvalidParamError'

describe('Image profile url', () => {
  test('Deve validar se é uma url', () => {
    const image = new ImageProfile('http://image-profile.com/image.jpg')
    expect(image.getValue()).toBe('http://image-profile.com/image.jpg')
  })

  test('Deve lançar erro se a url for inválida', () => {
    expect(() => new ImageProfile('http/image-profile.com/image.jpg')).toThrow(new InvalidParamError('url image profile'))
  })
})
