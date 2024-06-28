import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Ajv from 'ajv';
import { marketDataSchema } from './market.schema';

const ajv = new Ajv();

@Injectable()
export class ResponseValidationInterceptor implements NestInterceptor {
  private validate = ajv.compile(marketDataSchema);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!this.validate(data)) {
          const errorMessage = this.formatValidationErrors(
            this.validate.errors,
          );
          throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
        return data;
      }),
    );
  }

  private formatValidationErrors(errors: any[] | null | undefined): string {
    if (!errors) {
      return 'Unknown validation error';
    }
    return errors
      .map((err) => {
        return `Property '${err.params.missingProperty || err.instancePath}' ${err.message}`;
      })
      .join(', ');
  }
}
