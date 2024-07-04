import { ApiProperty } from '@nestjs/swagger';

export class MarketDataResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  current_price: number;

  @ApiProperty()
  market_cap: number;

  @ApiProperty()
  market_cap_rank: number;

  @ApiProperty({ type: [Number] })
  sparkline_in_7d: number[];

  @ApiProperty()
  price_change_percentage_24h: number;

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

class DataDto {
  @ApiProperty()
  price: number;

  @ApiProperty()
  price_btc: number;

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
  price_btc: string;

  @ApiProperty()
  score: number;

  @ApiProperty({ type: DataDto })
  data: DataDto;

  constructor(partial: Partial<TrendingMarketDataResponseDto>) {
    Object.assign(this, partial);
  }
}
