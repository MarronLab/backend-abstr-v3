import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import Ajv from 'ajv';
import { errorResponseSchema } from 'src/schema/common/error-response.schema';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

const ajv = new Ajv();
const validate = ajv.compile<ErrorResponse>(errorResponseSchema);

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.getStatus(exception);
    const message = this.formatMessage(this.getMessage(exception));

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message: message,
      error: HttpStatus[status] || 'Error',
    };

    if (!validate(errorResponse)) {
      console.error('Validation failed:', validate.errors);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          validate.errors
            ?.map((err) => `${err.instancePath} ${err.message}`)
            .join(', ') || 'Validation error',
        error: 'Validation Failed',
      });
    } else {
      response.status(status).json(errorResponse);
    }
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return this.extractMessageFromResponse(response);
    }
    return (exception as Error).message || 'Internal server error';
  }

  private extractMessageFromResponse(
    response: string | object,
  ): string | string[] {
    if (typeof response === 'string') {
      return response;
    } else if (typeof response === 'object' && 'message' in response) {
      return (response as any).message;
    }
    return 'Internal server error';
  }

  private formatMessage(message: string | string[]): string {
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    return message;
  }
}
