import {
  OrderSideEnum,
  OrderTypeEnum,
} from 'src/services/modulus/modulus.enum';

export class PlaceOrderResponseDto {
  id: number;

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
  status: boolean;
  ooc: number;

  constructor(partial: Partial<PlaceOrderPricedResponseDto>) {
    Object.assign(this, partial);
  }
}
