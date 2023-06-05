export default class Bio {
  private readonly value: string
  constructor (value: string) {
    if (value.length > 255) throw new Error('Invalid bio')
    this.value = value
  }

  getValue (): string {
    return this.value
  }
}
