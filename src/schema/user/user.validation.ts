import {
  Injectable,
  PipeTransform,
  BadRequestException,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import Ajv from 'ajv';
import {
  getSafeAddressSchema,
  getSafeAddressResponseSchema,
} from './user.schema';
import { Observable, map } from 'rxjs';

@Injectable()
export class ValidateRequestPipe implements PipeTransform {
  private ajv;

  constructor() {
    this.ajv = new Ajv({ allErrors: true });
  }

  transform(value: any) {
    if (typeof value !== 'string') {
      throw new BadRequestException(
        'Validation failed: userAddress must be a string',
      );
    }

    if (!/^\d+$/.test(value)) {
      const validate = this.ajv.compile(getSafeAddressSchema);
      const valid = validate({ userAddress: value });

      if (!valid) {
        throw new BadRequestException(
          'Validation failed: ' + this.ajv.errorsText(validate.errors),
        );
      }
    } else {
      throw new BadRequestException(
        'Validation failed: userAddress must be a string',
      );
    }

    return value;
  }
}

@Injectable()
export class ValidateResponseInterceptor implements NestInterceptor {
  private ajv;

  constructor() {
    this.ajv = new Ajv({ allErrors: true });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const validate = this.ajv.compile(getSafeAddressResponseSchema);
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
