import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiMarketDataQueries() {
  return applyDecorators(
    ApiQuery({
      name: 'per_page',
      required: false,
      type: Number,
      description: 'Default: 10',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Default: 1',
    }),
  );
}
