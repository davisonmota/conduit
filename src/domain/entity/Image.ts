export default class Image {
  constructor (private readonly url: string) {
    if (!url.match('^(https?|ftp)://[^s/$.?#].[^s]*$')) {
      throw new Error('Invalid image')
    }
  }

  getValue (): string {
    return this.url
  }
}
