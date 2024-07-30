import { ApiProperty } from '@nestjs/swagger';

export class CoinMarketDataDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  current_price: number;

  @ApiProperty()
  price_change_percentage_24h: number;

  @ApiProperty()
  price_change_24h: number;

  @ApiProperty()
  market_cap_rank: number;

  @ApiProperty()
  high_24h: number;

  @ApiProperty()
  low_24h: number;

  constructor(partial: Partial<CoinMarketDataDto>) {
    Object.assign(this, partial);
  }
}

export class GetSaveFavoriteCoinsResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty({
    description: 'Market data of the favorite coins',
    type: [CoinMarketDataDto],
  })
  data: CoinMarketDataDto[];

  constructor(partial: Partial<GetSaveFavoriteCoinsResponseDto>) {
    Object.assign(this, partial);
  }
}
