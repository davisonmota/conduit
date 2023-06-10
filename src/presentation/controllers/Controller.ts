import { type HttpRequest } from '../http/HttpRequest'
import { type HttpResponse } from '../http/HttpResponse'

export default interface Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>
}
