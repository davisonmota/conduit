export default interface UsernameQuery {
  findUsername(username: string): Promise<boolean>
}
