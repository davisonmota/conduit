export default interface UserQuery {
  verifyUsernameExist(username: string): Promise<boolean>
  verifyEmailExist(email: string): Promise<boolean>
}
