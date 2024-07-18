import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class SparklineIn7dDto {
  @ApiProperty({
    type: [Number],
    description: 'Price change sparkline for the last 7 days',
  })
  price: number[];
}

export class GetMarketDataQueryDto {
  @IsOptional()
  @IsString()
  vs_currency?: string;

  @IsOptional()
  @IsString()
  order?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  per_page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  sparkline?: boolean;
}

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
  sparkline_in_7d: SparklineIn7dDto;
  constructor(partial: Partial<MarketDataResponseDto>) {
    Object.assign(this, partial);
  }
}

class PriceChangePercentage24hDto {
  @ApiProperty()
  btc: number;

  @ApiProperty()
  usd: number;
}

class CoingeckoMarketData {
  @ApiProperty()
  price: number;

  @ApiProperty()
  price_btc: string;

  @ApiProperty({ type: PriceChangePercentage24hDto })
  price_change_percentage_24h: PriceChangePercentage24hDto;

  @ApiProperty()
  market_cap: string;

  @ApiProperty()
  market_cap_btc: string;

  @ApiProperty()
  total_volume: string;

  @ApiProperty()
  total_volume_btc: string;

  @ApiProperty()
  sparkline: string;
}

export class TrendingMarketDataResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  coin_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  market_cap_rank: number;

  @ApiProperty()
  thumb: string;

  @ApiProperty()
  small: string;

  @ApiProperty()
  large: string;

  @ApiProperty()
  price_btc: number;

  @ApiProperty()
  score: number;

  @ApiProperty({ type: CoingeckoMarketData })
  data: CoingeckoMarketData;

  constructor(partial: Partial<TrendingMarketDataResponseDto>) {
    Object.assign(this, partial);
  }
}

export class TopGainerLoserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  market_cap_rank: number;

  @ApiProperty()
  usd: number;

  @ApiProperty()
  usd_24h_vol: number;

  @ApiProperty()
  usd_24h_change: number;

  constructor(data: Partial<TopGainerLoserResponseDto>) {
    Object.assign(this, data);
  }
}

export class TopGainerLoserDataResponseDto {
  @ApiProperty({ type: [TopGainerLoserResponseDto] })
  top_gainers: TopGainerLoserResponseDto[];

  @ApiProperty({ type: [TopGainerLoserResponseDto] })
  top_losers: TopGainerLoserResponseDto[];

  constructor(data: Partial<TopGainerLoserDataResponseDto>) {
    Object.assign(this, data);
  }
}
