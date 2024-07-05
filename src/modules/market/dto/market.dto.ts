import { ApiProperty } from '@nestjs/swagger';

export class MarketDataResponseDto {
  @ApiProperty({ type: String, description: 'The ID of the coin' })
  id: string;

  @ApiProperty({ type: String, description: 'The symbol of the coin' })
  symbol: string;

  @ApiProperty({ type: String, description: 'The name of the coin' })
  name: string;

  @ApiProperty({ type: String, description: 'URL of the coin image' })
  image: string;

  @ApiProperty({ type: Number, description: 'Current price of the coin' })
  current_price: number;

  @ApiProperty({
    type: Number,
    description: 'Market capitalization of the coin',
  })
  market_cap: number | null;

  @ApiProperty({
    type: Number,
    description: 'Rank of the coin by market capitalization',
  })
  market_cap_rank: number;

  @ApiProperty({
    type: Number,
    description: 'Fully diluted valuation of the coin',
  })
  fully_diluted_valuation: number | null;

  @ApiProperty({
    type: Number,
    description: 'Total volume traded in the last 24 hours',
  })
  total_volume: number | null;

  @ApiProperty({
    type: Number,
    description: 'Highest price in the last 24 hours',
  })
  high_24h: number | null;

  @ApiProperty({
    type: Number,
    description: 'Lowest price in the last 24 hours',
  })
  low_24h: number | null;

  @ApiProperty({
    type: Number,
    description: 'Price change in the last 24 hours',
  })
  price_change_24h: number | null;

  @ApiProperty({
    type: Number,
    description: 'Percentage change in price in the last 24 hours',
  })
  price_change_percentage_24h: number | null;

  @ApiProperty({
    type: Number,
    description: 'Change in market cap in the last 24 hours',
  })
  market_cap_change_24h: number | null;

  @ApiProperty({
    type: Number,
    description: 'Percentage change in market cap in the last 24 hours',
  })
  market_cap_change_percentage_24h: number | null;

  @ApiProperty({ type: Number, description: 'Circulating supply of the coin' })
  circulating_supply: number | null;

  @ApiProperty({ type: Number, description: 'Total supply of the coin' })
  total_supply: number | null;

  @ApiProperty({ type: Number, description: 'Maximum supply of the coin' })
  max_supply: number | null;

  @ApiProperty({ type: Number, description: 'All-time high price of the coin' })
  ath: number | null;

  @ApiProperty({
    type: Number,
    description: 'Percentage change from all-time high price',
  })
  ath_change_percentage: number | null;

  @ApiProperty({ type: String, description: 'Date of the all-time high price' })
  ath_date: string;

  @ApiProperty({ type: Number, description: 'All-time low price of the coin' })
  atl: number | null;

  @ApiProperty({
    type: Number,
    description: 'Percentage change from all-time low price',
  })
  atl_change_percentage: number | null;

  @ApiProperty({ type: String, description: 'Date of the all-time low price' })
  atl_date: string;

  @ApiProperty({ type: String, description: 'Last updated timestamp' })
  last_updated: string;

  @ApiProperty({
    type: [Number],
    description: 'Price change sparkline for the last 7 days',
  })
  sparkline_in_7d: number[];
  constructor(partial: Partial<MarketDataResponseDto>) {
    Object.assign(this, partial);
  }
}
