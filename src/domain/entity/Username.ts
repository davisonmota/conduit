export default class Username {
  private readonly value: string

  constructor (value: string) {
    if (!value.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
      throw new Error('Invalid username')
    }
    this.value = value
  }

  getValue (): string {
    return this.value
  }
}
