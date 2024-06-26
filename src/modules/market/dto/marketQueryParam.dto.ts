import { ApiPropertyOptional } from '@nestjs/swagger';

export class MarketDataQueryParams {
  @ApiPropertyOptional({
    description: 'Target currency of coins and market data',
  })
  vs_currency?: string;

  @ApiPropertyOptional({
    description: "Coins' ids, comma-separated if querying more than 1 coin",
  })
  ids?: string;

  @ApiPropertyOptional({ description: "Filter based on coins' category" })
  category?: string;

  @ApiPropertyOptional({
    description: 'Sort result by field, default: market_cap_desc',
    enum: ['market_cap_desc', 'market_cap_asc', 'name_asc', 'name_desc'],
  })
  order?: string;

  @ApiPropertyOptional({ description: 'Total results per page, default: 100' })
  per_page?: number;

  @ApiPropertyOptional({ description: 'Page through results, default: 1' })
  page?: number;

  @ApiPropertyOptional({
    description: 'Include sparkline 7 days data, default: false',
  })
  sparkline?: boolean;

  @ApiPropertyOptional({
    description: 'Include price change percentage timeframe ',
    enum: ['1h', '24h', '7d', '14d', '30d', '200d', '1y'],
  })
  price_change_percentage?: string;

  @ApiPropertyOptional({ description: 'Language background, default: en' })
  locale?: string;

  @ApiPropertyOptional({
    description: 'Decimal place for currency price value',
  })
  precision?: string;
}
