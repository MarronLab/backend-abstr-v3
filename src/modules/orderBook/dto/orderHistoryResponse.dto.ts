import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  OrderSideEnum,
  OrderTypeEnum,
} from 'src/services/modulus/modulus.enum';

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

export class MatchedOrderResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the matched order.',
    example: 123456,
  })
  id: number;

  @ApiProperty({
    description: 'Volume of the order that was matched.',
    example: 0.5,
  })
  volume: number;

  @ApiProperty({
    description: 'Exchange rate at which the order was matched.',
    example: 45000.75,
  })
  rate: number;

  @ApiProperty({
    description: 'Identifier for the specific trade.',
    example: 'trade1234',
  })
  trade: string;

  @ApiProperty({
    description: 'Market in which the order was matched (e.g., BTC-USD).',
    example: 'BTC-USD',
  })
  market: string;

  @ApiProperty({
    description: 'Total amount for the matched order.',
    example: 22500.375,
  })
  amount: number;

  @ApiProperty({
    description: 'Service charge applied to the matched order.',
    example: 0.01,
  })
  serviceCharge: number;

  @ApiProperty({
    description: 'Date and time when the order was matched.',
    example: '2024-08-05T14:48:00Z',
    format: 'date-time',
  })
  date: string;

  @ApiProperty({
    description: 'Side of the order, indicating whether it was a BUY or SELL.',
    enum: ['BUY', 'SELL'],
    example: 'BUY',
  })
  side: 'BUY' | 'SELL';

  constructor(partial: Partial<MatchedOrderResponseDto>) {
    Object.assign(this, partial);
  }
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the order.',
    example: 987654,
  })
  id: number;

  @ApiProperty({
    description: 'Date and time when the order was placed.',
    example: '2024-08-05T14:48:00Z',
    format: 'date-time',
  })
  date: string;

  @ApiProperty({
    description: 'Currency pair for the order (e.g., BTC-USD).',
    example: 'BTC-USD',
  })
  currencyPair: string;

  @ApiProperty({
    description: 'Side of the order, indicating whether it is a BUY or SELL.',
    enum: OrderSideEnum,
    example: 'SELL',
  })
  side: OrderSideEnum;

  @ApiProperty({
    description: 'Type of trade for the order (e.g., market, limit).',
    enum: OrderTypeEnum,
    example: OrderTypeEnum.LIMIT,
  })
  tradeType: OrderTypeEnum;

  @ApiProperty({
    description: 'Price at which the order was placed.',
    example: '45000.75',
  })
  tradePrice: string;

  @ApiProperty({
    description: 'Average price at which the order was executed.',
    example: '44950.50',
  })
  averagePrice: string;

  @ApiProperty({
    description: 'Size of the order.',
    example: '1.0',
  })
  size: string;

  @ApiProperty({
    description: 'Amount of the order that has been filled.',
    example: '0.5',
  })
  filled: string;

  @ApiProperty({
    description: 'Fee paid for executing the order.',
    example: '22.50',
  })
  feePaid: string;

  @ApiProperty({
    description: 'Total value executed for the order.',
    example: '22475.25',
  })
  totalExecutedValue: string;

  @ApiProperty({
    description: 'Stop price for the order, applicable in stop-limit orders.',
    example: '45000.00',
  })
  stopPrice: string;

  @ApiProperty({
    description: 'Current status of the order.',
    enum: ['Filled', 'Cancelled', 'Pending'],
    example: 'Filled',
  })
  orderStatus: 'Filled' | 'Cancelled' | 'Pending';

  @ApiProperty({
    type: [MatchedOrderResponseDto],
    description: 'List of matched orders associated with this order.',
  })
  @Type(() => MatchedOrderResponseDto)
  mOrders: MatchedOrderResponseDto[];

  constructor(partial: Partial<OrderResponseDto>) {
    Object.assign(this, partial);
  }
}

export class OrderHistoryResponseDto {
  @ApiProperty({
    description: 'Pagination information for the order history.',
  })
  @Type(() => PageInfoResponseDto)
  pageInfo: PageInfoResponseDto;

  @ApiProperty({
    type: [OrderResponseDto],
    description: 'List of orders in the order history.',
  })
  @Type(() => OrderResponseDto)
  result: OrderResponseDto[];

  constructor(partial: Partial<OrderHistoryResponseDto>) {
    Object.assign(this, partial);
  }
}
