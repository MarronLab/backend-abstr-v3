import { ApiProperty } from '@nestjs/swagger';

export class RecentAddedCoinDto {
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
  high_24h: number;

  @ApiProperty()
  low_24h: number;

  @ApiProperty()
  price_change_percentage_24h: number;

  @ApiProperty()
  price_change_24h: number;

  constructor(partial: Partial<RecentAddedCoinDto>) {
    Object.assign(this, partial);
  }
}

export class RecentAddedCoinsResponseDto {
  @ApiProperty({ type: [RecentAddedCoinDto] })
  data: RecentAddedCoinDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;

  constructor(partial: Partial<RecentAddedCoinsResponseDto>) {
    Object.assign(this, partial);
  }
}
