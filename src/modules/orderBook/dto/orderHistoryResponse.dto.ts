import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  OrderSideEnum,
  OrderTypeEnum,
} from 'src/services/modulus/modulus.enum';

export class PageInfoResponseDto {
  @ApiProperty()
  totalRows: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;
}

export class MatchedOrderResponseDto {
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

  constructor(partial: Partial<MatchedOrderResponseDto>) {
    Object.assign(this, partial);
  }
}

export class OrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  currencyPair: string;

  @ApiProperty()
  side: OrderSideEnum;

  @ApiProperty()
  tradeType: OrderTypeEnum;

  @ApiProperty()
  tradePrice: string;

  @ApiProperty()
  averagePrice: string;

  @ApiProperty()
  size: string;

  @ApiProperty()
  filled: string;

  @ApiProperty()
  feePaid: string;

  @ApiProperty()
  totalExecutedValue: string;

  @ApiProperty()
  stopPrice: string;

  @ApiProperty()
  orderStatus: 'Filled' | 'Cancelled' | 'Pending';

  @ApiProperty({ type: [MatchedOrderResponseDto] })
  @Type(() => MatchedOrderResponseDto)
  mOrders: MatchedOrderResponseDto[];

  constructor(partial: Partial<OrderResponseDto>) {
    Object.assign(this, partial);
  }
}

export class OrderHistoryResponseDto {
  @ApiProperty()
  @Type(() => PageInfoResponseDto)
  pageInfo: PageInfoResponseDto;

  @ApiProperty({ type: [OrderResponseDto] })
  @Type(() => OrderResponseDto)
  result: OrderResponseDto[];

  constructor(partial: Partial<OrderHistoryResponseDto>) {
    Object.assign(this, partial);
  }
}
