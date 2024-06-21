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

export type ModulusBaseErrorResponseData = {
  status: 'Error';
  message: string;
  data: string;
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

export type PlaceOrderSuccessResponseData = {
  status: 'Success';
  message: string;
  data: {
    orderId: number;
    side: 'Buy' | 'Sell';
    orderType: OrderTypeEnum;
    size: number;
    filled: number;
    remaining: number;
    price: number;
    filledPrice: number;
  };
};

export type PlaceOrderResponse =
  | ModulusBaseErrorResponseData
  | PlaceOrderSuccessResponseData;

export type PlaceOrderPricedSuccessResponseData = {
  status: 'Success';
  message: string;
  data: {
    orderId: number;
    side: OrderSideEnum;
    orderType: OrderTypeEnum;
    size: number;
    filled: number;
    remaining: number;
    price: number;
    filledPrice: number;
  };
};

export type PlaceOrderPricedResponse =
  | ModulusBaseErrorResponseData
  | PlaceOrderPricedSuccessResponseData;

export type CancelOrderRequest = {
  orderId: number;
  side: 'ALL' | 'SELL' | 'BUY';
};

export type CancelOrderSuccessResponseData = {
  status: 'Success';
  message: string;
  data: {
    orderId: number;
    et: number;
    etm: number;
  };
};

export type CancelOrderResponse =
  | ModulusBaseErrorResponseData
  | CancelOrderSuccessResponseData;

//TradeHistory
export type TradeHistoryRequest = {
  side: 'ALL' | 'SELL' | 'BUY';
  pair: string;
  count: number;
  page: number;
};

export type TradeHistoryResponse = {
  status: 'Success';
  message: string;
  data: {
    pageInfo: {
      totalRows: number;
      currentPage: number;
      pageSize: number;
    };
    rows: {
      orderId: number;
      volume: number;
      rate: number;
      trade: string;
      market: string;
      amount: number;
      serviceCharge: number;
      date: string;
      side: 'BUY' | 'SELL';
    }[];
  };
};

//TradeHistory
export type OrderHistoryRequest = {
  side: 'ALL' | 'SELL' | 'BUY';
  pair: string;
  count: number;
  page: number;
};

export type OrderHistoryResponse = {
  status: 'Success';
  message: string;
  data: {
    pageInfo: {
      totalRows: number;
      currentPage: number;
      pageSize: number;
    };
    rows: {
      orderId: number;
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
      mOrders: {
        orderId: number;
        volume: number;
        rate: number;
        trade: string;
        market: string;
        amount: number;
        serviceCharge: number;
        date: string;
        side: 'BUY' | 'SELL';
      }[];
    }[];
  };
};

//GetBalance
export type GetBalanceSuccessResponseData = {
  status: 'Success';
  message: string;
  data: {
    currency: string;
    balance: number;
    balanceInTrade: number;
    holdDeposits: number;
  }[];
};

export type GetBalanceResponse =
  | ModulusBaseErrorResponseData
  | GetBalanceSuccessResponseData;
