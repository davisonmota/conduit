import { type HttpResponse } from '../http/HttpResponse'

export const unprocessableContent = (error: Error): HttpResponse => ({
  statusCode: 422,
  body: error
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    errors: {
      body: [error.message]
    }
  }
})
