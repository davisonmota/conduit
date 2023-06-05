import Bio from '../../../src/domain/entity/Bio'

describe('Bio', () => {
  test('Deve criar a bio', () => {
    const bio = new Bio('I love conduit')
    expect(bio.getValue()).toBe('I love conduit')
  })
})
