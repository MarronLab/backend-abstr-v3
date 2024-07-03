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
