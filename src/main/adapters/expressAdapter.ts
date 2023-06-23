import { type Request, type Response } from 'express'
import { type HttpRequest } from '../../presentation/http/HttpRequest'
import type Controller from '../../presentation/controllers/Controller'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      header: req.headers,
      body: req.body,
      params: req.params
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
