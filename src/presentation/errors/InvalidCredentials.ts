export class InvalidCredentials extends Error {
  constructor () {
    super('Authentication fails')
    this.name = 'InvalidCredentials'
  }
}
