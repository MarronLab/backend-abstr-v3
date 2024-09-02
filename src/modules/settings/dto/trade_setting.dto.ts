import { ApiProperty } from '@nestjs/swagger';

export class TradeSettingDto {
  @ApiProperty()
  coinName: string;

  @ApiProperty()
  marketName: string;

  @ApiProperty()
  minTickSize: number;

  @ApiProperty()
  minTradeAmount: number;

  @ApiProperty()
  minOrderValue: number;

  @ApiProperty()
  makerFee: number;

  @ApiProperty()
  takerFee: number;

  @ApiProperty()
  tradeEnabled: boolean;

  @ApiProperty()
  maxSize: number;

  @ApiProperty()
  maxOrderAmount: number;

  @ApiProperty()
  maxMarketOrderSize: number;

  constructor(partial: Partial<TradeSettingDto>) {
    Object.assign(this, partial);
  }
}
