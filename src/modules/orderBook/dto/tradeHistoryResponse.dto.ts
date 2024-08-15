import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PageInfoResponseDto {
  @ApiProperty({
    description: 'Total number of rows available in the dataset.',
    example: 150,
  })
  totalRows: number;

  @ApiProperty({
    description: 'Current page number in the pagination.',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Number of records per page.',
    example: 20,
  })
  pageSize: number;
}

export class TradeResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the trade.',
    example: 123456,
  })
  id: number;

  @ApiProperty({
    description: 'Volume of the trade.',
    example: 0.5,
  })
  volume: number;

  @ApiProperty({
    description: 'Exchange rate at which the trade was executed.',
    example: 45000.75,
  })
  rate: number;

  @ApiProperty({
    description: 'Identifier for the specific trade.',
    example: 'trade1234',
  })
  trade: string;

  @ApiProperty({
    description: 'Market in which the trade occurred (e.g., BTC-USD).',
    example: 'BTC-USD',
  })
  market: string;

  @ApiProperty({
    description: 'Total amount for the trade.',
    example: 22500.375,
  })
  amount: number;

  @ApiProperty({
    description: 'Service charge applied to the trade.',
    example: 0.01,
  })
  serviceCharge: number;

  @ApiProperty({
    description: 'Date and time when the trade occurred.',
    example: '2024-08-05T14:48:00Z',
    format: 'date-time',
  })
  date: string;

  @ApiProperty({
    description: 'Side of the trade, indicating whether it was a BUY or SELL.',
    enum: ['BUY', 'SELL'],
    example: 'BUY',
  })
  side: 'BUY' | 'SELL';

  constructor(partial: Partial<TradeResponseDto>) {
    Object.assign(this, partial);
  }
}

export class TradeHistoryResponseDto {
  @ApiProperty({
    description: 'Pagination information for the trade history.',
  })
  pageInfo: PageInfoResponseDto;

  @ApiProperty({
    type: [TradeResponseDto],
    description: 'List of trades in the trade history.',
  })
  @Type(() => TradeResponseDto)
  result: TradeResponseDto[];

  constructor(partial: Partial<TradeHistoryResponseDto>) {
    Object.assign(this, partial);
  }
}
