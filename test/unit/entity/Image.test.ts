import Image from '../../../src/domain/entity/Image'

describe('Image profile url', () => {
  test('Deve validar se é uma url', () => {
    const image = new Image('http://image-profile.com/image.jpg')
    expect(image.getValue()).toBe('http://image-profile.com/image.jpg')
  })

  test('Deve lançar erro se a url for inválida', () => {
    expect(() => new Image('http/image-profile.com/image.jpg')).toThrow(new Error('Invalid url image profile'))
  })
})
