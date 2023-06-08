import { Property } from './Property'

export default class Username extends Property {
  private value: string

  constructor (value: string) {
    Username.validate(value)
    super()
    this.value = value
  }

  static validate (value: string): void {
    if (!value.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
      throw new Error('Invalid username')
    }
  }

  update (value: string): void {
    Username.validate(value)
    this.value = value
  }

  getValue (): string {
    return this.value
  }
}
