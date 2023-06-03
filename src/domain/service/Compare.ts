export default interface Compare {
  compare(plainPassword: string, passwordHash: string): Promise<boolean>
}
