export class EmailInUserError extends Error {
  constructor () {
    super('Email already in use')
    this.name = 'EmailInUseError'
  }
}
