import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { isObject } from 'class-validator';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException | BadRequestException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();
    try {
      const status = exception.getStatus();
      const exceptionRes = exception.getResponse();

      const errorResponse = {
        code: status,
        path: request.url,
        method: request.method,
        message: exception.message,
        requestId: new Date().getTime(),
        success: false,
      };

      if (isObject(exceptionRes) && exception instanceof BadRequestException) {
        Object.assign(errorResponse, { errors: exceptionRes });
      }

      response.status(status).json(errorResponse);
    } catch (e) {
      return response.status(500).send('Internal Server Error');
    }
  }
}
