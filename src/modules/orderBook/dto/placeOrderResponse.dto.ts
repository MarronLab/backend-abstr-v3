import {
  OrderSideEnum,
  OrderTypeEnum,
} from 'src/services/modulus/modulus.enum';

export class PlaceOrderResponseDto {
  id: number;
  side: OrderSideEnum;
  type: OrderTypeEnum;
  size: number;
  filled: number;
  remaining: number;
  price: number;
  filledPrice: number;
  metadata: string;

  constructor(partial: Partial<PlaceOrderResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PlaceOrderPricedResponseDto {
  id: number;
  side: OrderSideEnum;
  type: OrderTypeEnum;
  size: number;
  filled: number;
  remaining: number;
  price: number;
  filledPrice: number;
  metadata: string;

  constructor(partial: Partial<PlaceOrderPricedResponseDto>) {
    Object.assign(this, partial);
  }
}
