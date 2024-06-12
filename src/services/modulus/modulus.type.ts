import {
  OrderSideEnum,
  OrderTimeInForceEnum,
  OrderTypeEnum,
} from './modulus.enum';

export type PlaceOrderRequest = {
  side: OrderSideEnum;
  market: string;
  trade: string;
  volume: number;
  rate: number;
  timeInForce: OrderTimeInForceEnum;
  clientOrderId: string;
  stop: number;
  type: OrderTypeEnum;
};

export type PlaceOrderPricedRequest = {
  amount: number;
} & Pick<PlaceOrderRequest, 'side' | 'trade' | 'market'>;

export type PlaceOrderResponseData = {
  orderId: number;
};

export type PlaceOrderResponse = {
  status: 'Success' | 'Error';
  message: null | string;
  data: null | PlaceOrderResponseData;
};

export type PlaceOrderPricedResponseData = {
  orderId: number;
  side: OrderSideEnum;
  orderType: OrderTypeEnum;
  size: number;
  filled: number;
  remaining: number;
  price: number;
  filledPrice: number;
  orderStatus: boolean;
  ooc: number;
};

export type PlaceOrderPricedResponse = {
  data: null | PlaceOrderPricedResponseData;
} & Pick<PlaceOrderResponse, 'status' | 'message'>;

export type CancelOrderRequest = {
  orderId: number;
  pair: string;
};
