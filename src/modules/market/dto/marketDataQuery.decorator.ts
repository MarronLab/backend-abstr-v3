import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiMarketDataQueries() {
  return applyDecorators(
    ApiQuery({
      name: 'vs_currency',
      required: false,
      type: String,
      description: 'Default: usd',
    }),
    ApiQuery({
      name: 'order',
      required: false,
      type: String,
      description: 'Default: market_cap_desc',
    }),
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
    ApiQuery({
      name: 'sparkline',
      required: false,
      type: Boolean,
      description: 'Default: true',
    }),
  );
}
