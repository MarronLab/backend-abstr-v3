import {
  OrderSideEnum,
  OrderSideExtendedEnum,
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

export type RegisterRequest = {
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  country: string;
  mobile: string;
  password: string;
  referralId?: string;
  mobileOTP: string;
};

export type RegisterSuccessResponse = {
  status: 'Success';
  message: string;
  data: {
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    country: string;
    mobile: string;
    password: string;
    referralId: number;
    mobileOTP: string;
  };
};
export type RegisterResponse =
  | ModulusBaseErrorResponseData
  | RegisterSuccessResponse;

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
  count?: number;
  page?: number;
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

//OrderHistory
export type OrderHistoryRequest = {
  side: OrderSideExtendedEnum;
  pair: string;
  count?: number;
  page?: number;
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
export type GetBalanceRequest = {
  currency: string;
};

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

export type GetCoinStatsResponse = {
  status: 'Success';
  message: string;
  data: {
    [key: string]: {
      exchangeTicker: string;
      dataSource: string;
      coinName: null | string;
      symbol: null | string;
      slug: string;
      image: null | string;
      rank: number;
      price: string;
      volume24h: null | string;
      marketCap: null | string;
      priceChangePercent24hr: null | string;
      circulatingSupply: null | string;
      sparkline: null | string;
      sparklineGraph: null | number[];
      maxSupply: null | string;
      priceChangePercent1h: null | string;
      priceChangePercent7d: null | string;
      priceChangePercent30: null | string;
      issueDate: string;
      lastUpdated: string;
      tags: null | string;
      tagsObject: null | string[];
      description: null | string;
      links_website: null | string;
      links_reddit: null | string;
      links_forum: null | string;
      links_explorer: null | string;
      links_sourceCode: null | string;
      objectlinks_sourceCode: null | Record<string, string[]>;
      links_technicalDoc: null | string;
      last_updatedon: string;
    };
  };
};

//Transactions
export type GetAllTransactionsRequest = {
  count?: number;
  page?: number;
};

export type TransactionData = {
  requestDate: string;
  amount: number;
  equivalentUsdAmt: number;
  currency: string;
  transactionID: string;
  rejectReason: null | string;
  comments: null | string;
  status: null | string;
  type: string;
  currentTxnCount: number;
  requiredTxnCount: number;
  explorerURL: string;
  address: string;
  confirmDate: string;
  fee: number;
  pg_name: null | string;
  memo: null | string;
  isPassedTravelRule: boolean;
};

export type GetAllTransactionsResponse = {
  status: 'Success';
  message: string;
  data: {
    pageInfo: {
      totalRows: number;
      currentPage: number;
      pageSize: number;
    };
    rows: TransactionData[];
  };
};

//Notifications
export type GetAllNotificationsRequest = {
  count?: number;
  page?: number;
};

export type NotificationData = {
  Id: number;
  CID: number;
  MessageTitle: string;
  MessageBody: string;
  AddedOn: string;
};

export type GetAllNotificationsErrorResponse = {
  status: 'Error';
  message: string;
};

export type GetAllNotificationsSuccessResponse = {
  status: 'Success';
  message: string;
  data: {
    pageInfo: {
      totalRows: number;
      currentPage: number;
      pageSize: number;
    };
    rows: NotificationData[];
  };
};

export type GetAllNotificationsResponse =
  | GetAllNotificationsErrorResponse
  | GetAllNotificationsSuccessResponse;

export type NotificationsMarkReadResponse = {
  status: 'Error' | 'Success';
  message: string;
};

//GetProfile
export type ProfileData = {
  customerID: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  loginName: string;
  joinedOn: string;
  is2FAEnabled: boolean;
  isMobileVerified: boolean;
  kycStatus: string;
  kycApprovedBy: null | string;
  country: string;
  mobileNumber: string;
  kycRejectReason: string;
  kycRequestInfo: string;
  kycApprovedLevel: null | string;
  currentStatus: null | string;
  isUserBlocked: boolean;
  corporateName: string;
  priceChangeAlert: boolean;
  priceChangePercentage: string;
  discounts: {
    token_discount: number;
    fee_groups: number;
    volume_discount: number;
    total_discount: number;
  };
  customFields: [];
  kycType: string;
};

export type GetProfileErrorResponse = {
  status: 'Error';
  message: string;
  data: string;
};

export type GetProfileSuccessResponse = {
  status: 'Success';
  message: string;
  data: ProfileData;
};

export type GetProfileResponse =
  | GetProfileErrorResponse
  | GetProfileSuccessResponse;
