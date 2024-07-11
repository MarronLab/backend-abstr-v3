import { ApiProperty } from '@nestjs/swagger';

export class OpenOrderDataDto {
  @ApiProperty()
  MarketType: string;

  @ApiProperty()
  CurrencyType: string;

  @ApiProperty()
  Rate: number;

  @ApiProperty()
  Volume: number;
}

export class AssetOpenOrderDataDto {
  @ApiProperty()
  Pair: string;

  @ApiProperty()
  Type: string;

  @ApiProperty({ type: [OpenOrderDataDto] })
  Orders: OpenOrderDataDto[];
}

export class AssetOpenOrderResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: AssetOpenOrderDataDto })
  data: AssetOpenOrderDataDto;

  constructor(partial: Partial<AssetOpenOrderResponseDto>) {
    Object.assign(this, partial);
  }
}
