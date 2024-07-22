import {
  OrderSideEnum,
  OrderSideExtendedEnum,
  OrderTimeInForceEnum,
  OrderTypeEnum,
} from './modulus.enum';

export type AuthenticateUserSuccessResponse =
  | {
      access_token: string;
      token_type: string;
      expires_in: number;
    }
  | {
      status: 'Success';
      message: string;
      data: {
        tempAuthToken: string;
        tokenExpiry: string;
        twoFAMehtod: string;
      };
    };

export type AuthenticateUserErrorResponse = ModulusBaseErrorResponseData;

export type AuthenticateUserResponse =
  | AuthenticateUserErrorResponse
  | AuthenticateUserSuccessResponse;

export type PageInfo = {
  totalRows: number;
  currentPage: number;
  pageSize: number;
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
  email: string;
  password: string;
};

export type RegisterSuccessResponse = {
  status: 'Success';
  message: string;
  data: null;
};

export type RegisterErrorResponse = {
  status: 'Error';
  message: string;
  data: string;
};

export type RegisterResponse = RegisterErrorResponse | RegisterSuccessResponse;

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
    pageInfo: PageInfo;
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
    pageInfo: PageInfo;
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
    pageInfo: PageInfo;
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
    pageInfo: PageInfo;
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

//API Key - generate api key
export type GenerateApiKeyRequest = {
  keyType: string;
  twoFactorAuthKey: string;
  IpAddresses: string;
};

export type GenerateApiKeyData = {
  privateKey: string;
  publicKey: string;
};

export type GenerateApiKeyErrorResponse = {
  status: 'Error';
  message: string;
  data: string;
};

export type GenerateApiKeySuccessResponse = {
  status: 'Success';
  message: string;
  data: GenerateApiKeyData;
};

export type GenerateApiKeyResponse =
  | GenerateApiKeyErrorResponse
  | GenerateApiKeySuccessResponse;

//API Key - list api keys
export type ListApiKeysRequest = {
  keyType: string;
};

export type ListApiKeysData = {
  key: string;
  type: string;
  trustedIPs: string;
  generatedOn: string;
  lastHit: null | string;
  account: string;
};

export type ListApiKeysErrorResponse = {
  status: 'Error';
  message: string;
  data: string;
};

export type ListApiKeysSuccessResponse = {
  status: 'Success';
  message: string;
  data: ListApiKeysData[];
};

export type ListApiKeysResponse =
  | ListApiKeysErrorResponse
  | ListApiKeysSuccessResponse;

//API Key - list api keys
export type DeleteApiKeyRequest = {
  key: string;
};

export type DeleteApiKeyErrorResponse = {
  status: 'Error';
  message: string;
  data: string;
};

export type DeleteApiKeySuccessResponse = {
  status: 'Success';
  message: string;
  data: null;
};

export type DeleteApiKeyResponse =
  | DeleteApiKeyErrorResponse
  | DeleteApiKeySuccessResponse;

//Verify Account
export type VerifyAccountRequest = {
  otp: string;
};

export type VerifyAccountErrorResponse = {
  status: 'Error';
  message: string;
  data: string;
};

export type VerifyAccountSuccessResponse = {
  status: 'Success';
  message: string;
  data: null;
};

export type VerifyAccountResponse =
  | DeleteApiKeyErrorResponse
  | DeleteApiKeySuccessResponse;

//Signup Resend Email
export type SignupResendEmailRequest = {
  email: string;
};

export type SignupResendEmailErrorResponse = {
  status: 'Error';
  message: string;
  data: string;
};

export type SignupResendEmailSuccessResponse = {
  status: 'Success';
  message: string;
  data: null;
};

export type SignupResendEmailResponse =
  | DeleteApiKeyErrorResponse
  | DeleteApiKeySuccessResponse;

//Google authenticator - GAuth_Check_Status
export type GAuthCheckStatusErrorResponse = {
  status: 'Error';
  message: string;
  data: string;
};

export type GAuthCheckStatusSuccessResponse = {
  status: 'Success';
  message: string;
  data: true;
};

export type GAuthCheckStatusResponse =
  | GAuthCheckStatusSuccessResponse
  | GAuthCheckStatusErrorResponse;

//Google authenticator - GAuth_Enable_Request
export type GAuthEnableRequestErrorResponse = ModulusBaseErrorResponseData;

export type GAuthEnableRequestSuccessResponse = {
  status: 'Success';
  message: string;
  data: { pairingCode: string; qR_Code: string };
};

export type GAuthEnableRequestResponse =
  | GAuthEnableRequestSuccessResponse
  | GAuthEnableRequestErrorResponse;

//Google authenticator - GAuth_Set_Enable
export type GAuthSetEnableRequest = {
  GAuth_Code: string;
};

export type GAuthSetEnableErrorResponse = ModulusBaseErrorResponseData;

export type GAuthSetEnableSuccessResponse = {
  status: 'Success';
  message: string;
  data: string;
};

export type GAuthSetEnableResponse =
  | GAuthSetEnableSuccessResponse
  | GAuthSetEnableErrorResponse;

//Google authenticator - GAuth_Disable_Request
export type GAuthDisableRequestRequest = {
  GAuth_Code: string;
};

export type GAuthDisableRequestErrorResponse = ModulusBaseErrorResponseData;

export type GAuthDisableRequestSuccessResponse = {
  status: 'Success';
  message: string;
  data: string;
};

export type GAuthDisableRequestResponse =
  | GAuthDisableRequestSuccessResponse
  | GAuthDisableRequestErrorResponse;

//Change Email
export type ChangeEmailRequest = {
  NewEmail: string;
};

export type ChangeEmailErrorResponse = ModulusBaseErrorResponseData;

export type ChangeEmailSuccessResponse = {
  status: 'Success';
  message: string;
  data: null;
};

export type ChangeEmailResponse =
  | ChangeEmailErrorResponse
  | ChangeEmailSuccessResponse;

//Change Password - Request Otp
export type RequestChangePasswordOTPErrorResponse =
  ModulusBaseErrorResponseData;

export type RequestChangePasswordOTPSuccessResponse = {
  status: 'Success';
  message: string;
  data: null;
};

export type RequestChangePasswordOTPResponse =
  | RequestChangePasswordOTPErrorResponse
  | RequestChangePasswordOTPSuccessResponse;

//Change Password
export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
  otp?: string;
};

export type ChangePasswordErrorResponse = ModulusBaseErrorResponseData;

export type ChangePasswordSuccessResponse = {
  status: 'Success';
  message: string;
  data: null;
};

export type ChangePasswordResponse =
  | ChangePasswordErrorResponse
  | ChangePasswordSuccessResponse;

//Change Email - Verify Otp
export type ChangeEmailVerifyOtpRequest = {
  OTP_New: string;
  OTP_Old: string;
};

export type ChangeEmailVerifyOtpErrorResponse = ModulusBaseErrorResponseData;

export type ChangeEmailVerifyOtpSuccessResponse = {
  status: 'Success';
  message: string;
  data: null;
};

export type ChangeEmailVerifyOtpResponse =
  | ChangeEmailVerifyOtpErrorResponse
  | ChangeEmailVerifyOtpSuccessResponse;

//Asset Open Order
export type AssetOpenOrderRequest = {
  pair: string;
  side: 'BUY' | 'SELL';
  depth?: number;
};

export type OpenOrderData = {
  MarketType: string;
  CurrencyType: string;
  Rate: number;
  Volume: number;
  Total: number;
};

export type AssetOpenOrderData = {
  Pair: string;
  Type: string;
  Orders: OpenOrderData[];
  lastTradedPrice: AssetCurrencyData;
};

export type AssetOpenOrderSuccessResponse = {
  status: 'Success';
  message: string;
  data: AssetOpenOrderData;
};

export type AssetOpenOrderErrorResponse = {
  status: 'Error';
  errorMessage: string;
  data: string;
};

export type AssetOpenOrderResponse =
  | AssetOpenOrderErrorResponse
  | AssetOpenOrderSuccessResponse;

// Get currency pair price
export type AssetCurrencyPriceRequest = {
  pair: string;
};

export type AssetCurrencyData = {
  Pair: string;
  Price: number;
};

export type AssetCurrencyPriceResponse = {
  status: 'Success';
  message: string;
  data: AssetCurrencyData;
};

export type MarketSummaryPairData = {
  Last: number;
  LowestAsk: number;
  HeighestBid: number;
  PercentChange: number;
  BaseVolume: number;
  QuoteVolume: number;
  High_24hr: number;
  Low_24hr: number;
};

export type MarketSummaryResponse = {
  status: 'Success';
  message: string;
  data: {
    [key: string]: MarketSummaryPairData;
  };
};

//Sign in - Access token
export type TokenRequest = {
  grant_type: string;
  username: string;
  password: string;
};

export type TokenErrorResponse = {
  error: string;
  error_description: string;
};

export type TokenSuccessResponse = {
  access_token: string;
  token_type: string;
  expires_in: string;
};

export type TokenResponse = TokenErrorResponse | TokenSuccessResponse;

//Resend email OTP
export type ResendEmailOTPErrorResponse = ModulusBaseErrorResponseData;

export type ResendEmailOTPSuccessResponse = {
  status: 'Success';
  message: string;
  data: null;
};

export type ResendEmailOTPResponse =
  | ResendEmailOTPErrorResponse
  | ResendEmailOTPSuccessResponse;

//Validate bearer token
export type ValidateBearerTokenErrorResponse = {
  Message: string;
};

export type ValidateBearerTokenSuccessResponse = {
  status: 'Success';
  message: string;
  data: null;
};

export type ValidateBearerTokenResponse =
  | ValidateBearerTokenErrorResponse
  | ValidateBearerTokenSuccessResponse;

export type GetWhiteListedDevicesData = {
  id: number;
  deviceID: string;
  browser: string;
  os: string;
  device: string;
  ip: string;
  addedOn: string;
};

export type GetWhiteListedDevicesResponse = {
  status: 'Success';
  message: string;
  data: GetWhiteListedDevicesData;
};
