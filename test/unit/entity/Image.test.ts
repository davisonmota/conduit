import Image from '../../../src/domain/entity/Image'

describe('Image profile url', () => {
  test('Deve validar se é uma url', () => {
    const image = new Image('http://image-profile.com/image.jpg')
    expect(image.getValue()).toBe('http://image-profile.com/image.jpg')
  })
})
