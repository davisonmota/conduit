export default interface Hash {
  hash(value: string): Promise<string>
}
