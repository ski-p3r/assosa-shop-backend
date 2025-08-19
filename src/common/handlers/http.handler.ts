import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let details: unknown = null;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        exception.message ||
        (typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? (exceptionResponse['message'] as string)
          : 'Internal Server Error');
      details = exceptionResponse;
    } else if (exception instanceof Error) {
      message = exception.message;
    } else {
      message = String(exception);
    }

    this.logger.error(
      message,
      exception instanceof Error ? exception.stack : null,
    );

    response.status(statusCode).json({
      statusCode,
      message,
      details,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }
}
