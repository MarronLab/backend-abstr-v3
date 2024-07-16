import { JSONSchemaType } from 'ajv';
import {
  OrderSideEnum,
  OrderTypeEnum,
} from 'src/services/modulus/modulus.enum';
// import {
//   MarketSummaryResponseDto,
//   MarketSummaryPairDataDto,
//   MarketSummaryDataDto,
// } from './dto/marketSummary.dto';

export const placeOrderResponseSchema: JSONSchemaType<{
  id: number;
  side: OrderSideEnum;
  type: OrderTypeEnum;
  size: number;
  filled: number;
  remaining: number;
  price: number;
  filledPrice: number;
  metadata: string;
}> = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    side: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    size: {
      type: 'number',
    },
    filled: {
      type: 'number',
    },
    remaining: {
      type: 'number',
    },
    price: {
      type: 'number',
    },
    filledPrice: {
      type: 'number',
    },
    metadata: {
      type: 'string',
    },
  },
  required: [
    'id',
    'size',
    'price',
    'side',
    'type',
    'filled',
    'remaining',
    'filledPrice',
    'metadata',
  ],
  additionalProperties: false,
};

export const placeOrderPricedResponseSchema: JSONSchemaType<{
  id: number;
  side: OrderSideEnum;
  type: OrderTypeEnum;
  size: number;
  filled: number;
  remaining: number;
  price: number;
  filledPrice: number;
  metadata: string;
}> = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    side: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    size: {
      type: 'number',
    },
    filled: {
      type: 'number',
    },
    remaining: {
      type: 'number',
    },
    price: {
      type: 'number',
    },
    filledPrice: {
      type: 'number',
    },
    metadata: {
      type: 'string',
    },
  },
  required: [
    'id',
    'side',
    'type',
    'size',
    'filled',
    'remaining',
    'price',
    'filledPrice',
    'metadata',
  ],
  additionalProperties: false,
};

export const cancelOrderResponseSchema: JSONSchemaType<{
  id: number;
  et: number;
  etm: number;
}> = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    et: {
      type: 'number',
    },
    etm: {
      type: 'number',
    },
  },
  required: ['id', 'et', 'etm'],
  additionalProperties: false,
};

export const orderHistoryResponseSchema: JSONSchemaType<{
  pageInfo: {
    totalRows: number;
    currentPage: number;
    pageSize: number;
  };
  result: {
    id: number;
    date: string;
    currencyPair: string;
    side: string;
    tradeType: string;
    tradePrice: string;
    averagePrice: string;
    size: string;
    filled: string;
    feePaid: string;
    totalExecutedValue: string;
    stopPrice: string;
    orderStatus: string;
    mOrders: {
      id: number;
      volume: number;
      rate: number;
      trade: string;
      market: string;
      amount: number;
      serviceCharge: number;
      date: string;
      side: string;
    }[];
  }[];
}> = {
  type: 'object',
  additionalProperties: false,
  required: ['pageInfo', 'result'],
  properties: {
    pageInfo: {
      type: 'object',
      properties: {
        totalRows: { type: 'number' },
        currentPage: { type: 'number' },
        pageSize: { type: 'number' },
      },
      required: ['totalRows', 'currentPage', 'pageSize'],
    },
    result: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'id',
          'date',
          'currencyPair',
          'side',
          'tradeType',
          'tradePrice',
          'averagePrice',
          'size',
          'filled',
          'feePaid',
          'totalExecutedValue',
          'stopPrice',
          'orderStatus',
          'mOrders',
        ],
        properties: {
          id: { type: 'number' },
          date: { type: 'string' },
          currencyPair: { type: 'string' },
          side: { type: 'string' },
          tradeType: { type: 'string' },
          tradePrice: { type: 'string' },
          averagePrice: { type: 'string' },
          size: { type: 'string' },
          filled: { type: 'string' },
          feePaid: { type: 'string' },
          totalExecutedValue: { type: 'string' },
          stopPrice: { type: 'string' },
          orderStatus: { type: 'string' },
          mOrders: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                volume: { type: 'number' },
                rate: { type: 'number' },
                trade: { type: 'string' },
                market: { type: 'string' },
                amount: { type: 'number' },
                serviceCharge: { type: 'number' },
                date: { type: 'string' },
                side: { type: 'string' },
              },
              required: [
                'id',
                'volume',
                'rate',
                'trade',
                'market',
                'amount',
                'serviceCharge',
                'date',
                'side',
              ],
            },
          },
        },
      },
    },
  },
};

export const tradeHistoryResponseSchema: JSONSchemaType<{
  pageInfo: {
    totalRows: number;
    currentPage: number;
    pageSize: number;
  };
  result: {
    id: number;
    volume: number;
    rate: number;
    trade: string;
    market: string;
    amount: number;
    serviceCharge: number;
    date: string;
    side: string;
  }[];
}> = {
  type: 'object',
  additionalProperties: false,
  required: ['pageInfo', 'result'],
  properties: {
    pageInfo: {
      type: 'object',
      properties: {
        totalRows: { type: 'number' },
        currentPage: { type: 'number' },
        pageSize: { type: 'number' },
      },
      required: ['totalRows', 'currentPage', 'pageSize'],
    },
    result: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'id',
          'volume',
          'rate',
          'trade',
          'market',
          'amount',
          'serviceCharge',
          'date',
          'side',
        ],
        properties: {
          id: { type: 'number' },
          volume: { type: 'number' },
          rate: { type: 'number' },
          trade: { type: 'string' },
          market: { type: 'string' },
          amount: { type: 'number' },
          serviceCharge: { type: 'number' },
          date: { type: 'string' },
          side: { type: 'string' },
        },
      },
    },
  },
};

export const marketSummaryDataSchema: JSONSchemaType<{
  Last: number;
  LowestAsk: number;
  HeighestBid: number;
  PercentChange: number;
  BaseVolume: number;
  QuoteVolume: number;
  High_24hr: number;
  Low_24hr: number;
}> = {
  type: 'object',
  properties: {
    Last: { type: 'number' },
    LowestAsk: { type: 'number' },
    HeighestBid: { type: 'number' },
    PercentChange: { type: 'number' },
    BaseVolume: { type: 'number' },
    QuoteVolume: { type: 'number' },
    High_24hr: { type: 'number' },
    Low_24hr: { type: 'number' },
  },
  required: [
    'Last',
    'LowestAsk',
    'HeighestBid',
    'PercentChange',
    'BaseVolume',
    'QuoteVolume',
    'High_24hr',
    'Low_24hr',
  ],
  additionalProperties: false,
};

export const marketSummaryResponseSchema: JSONSchemaType<{
  [key: string]: {
    Last: number;
    LowestAsk: number;
    HeighestBid: number;
    PercentChange: number;
    BaseVolume: number;
    QuoteVolume: number;
    High_24hr: number;
    Low_24hr: number;
  };
}> = {
  type: 'object',
  required: [],
  additionalProperties: marketSummaryDataSchema,
};
