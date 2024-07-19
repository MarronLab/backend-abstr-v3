import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    const errorResponse: ErrorResponse = {
      message: message,
      error: HttpStatus[status] || 'Error',
      statusCode: status,
    };

    response.status(status).json(errorResponse);
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return this.extractMessageFromResponse(response);
    }
    return (exception as Error).message || 'Internal server error';
  }

  private extractMessageFromResponse(response: string | object): string {
    if (typeof response === 'string') {
      return response;
    } else if (typeof response === 'object' && 'message' in response) {
      return (response as any).message;
    }
    return 'Internal server error';
  }
}
