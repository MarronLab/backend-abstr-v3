import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import Ajv, { JSONSchemaType } from 'ajv';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseValidationInterceptor<T>
  implements NestInterceptor<T, any>
{
  private ajv;

  constructor(private readonly schema: JSONSchemaType<T>) {
    this.ajv = new Ajv({ allErrors: true });
  }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const validate = this.ajv.compile(this.schema);
        const valid = validate(data);

        if (!valid) {
          throw new BadRequestException(
            'Response validation failed: ' +
              this.ajv.errorsText(validate.errors),
          );
        }

        return data;
      }),
    );
  }
}
