export enum TimeInForceType {
  TIF_NONE = 0, // Handled the same as default of NONE
  TIF_GTC = 1, // Good 'Til Cancelled: Not currently implemented; needs an external "close session" request since the exchange is 24/7
  TIF_DAY = 2, // Day Order
  TIF_IOC = 3, // Immediate Or Cancel
  TIF_FOK = 4, // Fill Or Kill
}

export enum SideType {
  SIDE_NONE = 0,
  SIDE_BUY = 1,
  SIDE_SELL = 2,
}

export enum OrderType {
  ORDER_TYPE_NONE = 0,
  ORDER_TYPE_MARKET = 1,
  ORDER_TYPE_LIMIT = 2,
  ORDER_TYPE_STOP_MARKET = 3,
  ORDER_TYPE_STOP_LIMIT = 4,
  ORDER_TYPE_TRAILING_STOP_LIMIT = 5, // Unsupported: Might need to be done externally due to latency concerns
  ORDER_TYPE_TRAILING_STOP_MARKET = 6, // Unsupported: Might need to be done externally due to latency concerns
}

export enum OrderStatusType {
  ORDER_STATUS_NONE = 0, // 0
  ORDER_STATUS_ACCEPTED = 1, // 1
  ORDER_STATUS_PARTIALLY_FILLED = 2, // 2
  ORDER_STATUS_FILLED = 3, // 3
  ORDER_STATUS_CANCELLED = 4, // 4
  ORDER_STATUS_REJECTED = 5, // 5
  ORDER_STATUS_EXPIRED = 6, // 6 (not used)
  ORDER_STATUS_ORDER_STATUS_END = 7, // 7
  ORDER_STATUS_CANCEL_ACCEPTED = 8, // 8
  ORDER_STATUS_CANCEL_REJECTED = 9, // 9
  ORDER_STATUS_STOP_ACTIVATED = 10, // 10
}

interface NewTrade {
  BuyerUserID: number;
  SellerUserID: number;
  BuyOrderID: number;
  SellOrderID: number;
  MakerOrderID: number;
  TakerOrderID: number;
  Timestamp: string; // ISO date format
  CurrencyPair: string;
  Price: number;
  Size: number;
  TradeId: string;
}

export interface OrdersI {
  CurrencyPair: string;
  Size: number;
  Side: SideType;
  Type: OrderType;
  TimeInForce: TimeInForceType;
  LimitPrice: number;
  StopPrice: number;
  TrailingAmount: number;
  OrderID: number;
  UserID: number;
  StopOrderActivated: boolean;
  OrderIDOCO: number;
  TimeAccepted: string; // ISO date format
  TimeModified: string; // ISO date format
  Status: OrderStatusType;
  MessageID: number;
  Remaining: number;
  Balance: number;
  extraData: any; // Replace 'any' with the appropriate type if known
  ReSubmitMarketOrder: boolean;
}

interface Event {
  MatchEventID: string;
  UpdatedBuyOrders: OrdersI[]; // Assuming the structure is similar, if not, define separately
  UpdatedSellOrders: OrdersI[];
  NewTrades: NewTrade[];
}

export interface SubmitOrderResponse {
  OrderID: number;
  RequestStatus: OrderStatusType;
  ErrorReason: number;
  Event: Event;
}
