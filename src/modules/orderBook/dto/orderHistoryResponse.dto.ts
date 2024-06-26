import { Type } from 'class-transformer';
import {
  OrderSideEnum,
  OrderTypeEnum,
} from 'src/services/modulus/modulus.enum';

export class MatchedOrdersResponseDto {
  id: number;
  volume: number;
  rate: number;
  trade: string;
  market: string;
  amount: number;
  serviceCharge: number;
  date: string;
  side: 'BUY' | 'SELL';

  constructor(partial: Partial<MatchedOrdersResponseDto>) {
    Object.assign(this, partial);
  }
}

export class OrderHistoryResponseDto {
  id: number;
  date: string;
  currencyPair: string;
  side: OrderSideEnum;
  tradeType: OrderTypeEnum;
  tradePrice: string;
  averagePrice: string;
  size: string;
  filled: string;
  feePaid: string;
  totalExecutedValue: string;
  stopPrice: string;
  orderStatus: 'Filled' | 'Cancelled' | 'Pending';

  @Type(() => MatchedOrdersResponseDto)
  mOrders: MatchedOrdersResponseDto[];

  constructor(partial: Partial<OrderHistoryResponseDto>) {
    Object.assign(this, partial);
  }
}
