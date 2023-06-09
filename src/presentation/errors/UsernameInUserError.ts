export class UsernameInUserError extends Error {
  constructor () {
    super('Username already exist')
    this.name = 'UsernameInUserError'
  }
}
