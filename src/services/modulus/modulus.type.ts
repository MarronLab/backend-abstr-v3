import {
  OrderSideEnum,
  OrderTimeInForceEnum,
  OrderTypeEnum,
} from './modulus.enum';

export type AuthenticateUserResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

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
  side: 'Buy' | 'Sell';
  orderType: OrderTypeEnum;
  size: number;
  filled: number;
  remaining: number;
  price: number;
  filledPrice: number;
};

export type PlaceOrderResponse = {
  status: 'Success' | 'Error';
  message: string;
  data: string | PlaceOrderResponseData;
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
  data: string | PlaceOrderPricedResponseData;
} & Pick<PlaceOrderResponse, 'status' | 'message'>;

export type CancelOrderRequest = {
  orderId: number;
  side: 'ALL' | 'SELL' | 'BUY';
};

export type CancelOrderResponseData = {
  orderId: number;
  et: number;
  etm: number;
};

export type CancelOrderResponse = {
  data: string | CancelOrderResponseData;
} & Pick<PlaceOrderResponse, 'status' | 'message'>;
