import ImageProfile from '../../../src/domain/entity/ImageProfile'

describe('Image profile url', () => {
  test('Deve validar se é uma url', () => {
    const image = new ImageProfile('http://image-profile.com/image.jpg')
    expect(image.getValue()).toBe('http://image-profile.com/image.jpg')
  })

  test('Deve lançar erro se a url for inválida', () => {
    expect(() => new ImageProfile('http/image-profile.com/image.jpg')).toThrow(new Error('Invalid url image profile'))
  })
})
