import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import Ajv from 'ajv';
import { getSafeAddressSchema } from './user.schema';

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
