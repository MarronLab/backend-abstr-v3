import Ajv from 'ajv';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { marketDataSchema } from '../../schema/market/market.schema';

const ajv = new Ajv();

@Injectable()
export class ValidationService {
  private validate = ajv.compile(marketDataSchema);

  validateData(data: any) {
    if (!this.validate(data)) {
      const errorMessage = this.formatValidationErrors(this.validate.errors);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
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
