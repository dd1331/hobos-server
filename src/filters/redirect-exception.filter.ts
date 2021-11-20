import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class RedirectExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = (exception.getResponse() as {
      statusCode: number;
      message: string;
    }).message;
    response
      .status(status)
      .redirect(
        `${process.env.CLIENT_URL}/login/?message=${message}&url=${request.url}`,
      );
    return response;
  }
}
