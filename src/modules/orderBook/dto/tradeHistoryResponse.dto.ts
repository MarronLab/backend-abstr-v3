import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PageInfoResponseDto {
  @ApiProperty()
  totalRows: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;
}

export class TradeResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  volume: number;

  @ApiProperty()
  rate: number;

  @ApiProperty()
  trade: string;

  @ApiProperty()
  market: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  serviceCharge: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  side: 'BUY' | 'SELL';

  constructor(partial: Partial<TradeResponseDto>) {
    Object.assign(this, partial);
  }
}

export class TradeHistoryResponseDto {
  @ApiProperty()
  pageInfo: PageInfoResponseDto;

  @ApiProperty({ type: [TradeResponseDto] })
  @Type(() => TradeResponseDto)
  result: TradeResponseDto[];

  constructor(partial: Partial<TradeHistoryResponseDto>) {
    Object.assign(this, partial);
  }
}
