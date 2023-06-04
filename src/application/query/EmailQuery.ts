export default interface EmailQuery {
  findEmail(email: string): Promise<boolean>
}
