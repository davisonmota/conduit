export default class ImageProfile {
  constructor (private readonly url: string) {
    if (!url.match('^(https?|ftp)://[^s/$.?#].[^s]*$')) {
      throw new Error('Invalid url image profile')
    }
  }

  getValue (): string {
    return this.url
  }
}
