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
import addFormats from 'ajv-formats';
import { trendingMarketSchema } from './market.schema';

const ajv = new Ajv();
addFormats(ajv);

@Injectable()
export class TrendResponseValidationInterceptor implements NestInterceptor {
  private validate = ajv.compile(trendingMarketSchema);

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
