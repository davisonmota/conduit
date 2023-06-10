import { type HttpResponse } from '../http/HttpResponse'

export const unprocessableContent = (error: Error): HttpResponse => ({
  statusCode: 422,
  body: {
    errors: {
      body: [error.message]
    }
  }
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    errors: {
      body: [error.message]
    }
  }

})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: {
    errors: {
      body: [error.message]
    }
  }
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: {
    errors: {
      body: ['Invernal server error']
    }
  }
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: {
    ...data
  }
})
