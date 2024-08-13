import { JSONSchemaType } from 'ajv';

export const getBalancesResponseSchema: JSONSchemaType<
  {
    currency: string;
    fiatValue: number;
    currencyName: null | string;
    balance: number;
    balanceInTrade: number;
    holdDeposits: number;
    priceChangePercent24hr: null | string;
  }[]
> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      currency: {
        type: 'string',
      },
      fiatValue: {
        type: 'number',
      },
      currencyName: {
        type: 'string',
        nullable: true as false, // this is a workaround for ajv to accept null without typescript complaining
      },
      balance: {
        type: 'number',
      },
      balanceInTrade: {
        type: 'number',
      },
      holdDeposits: {
        type: 'number',
      },
      priceChangePercent24hr: {
        type: 'string',
        nullable: true as false, // this is a workaround for ajv to accept null without typescript complaining
      },
    },
    required: [
      'currency',
      'balance',
      'balanceInTrade',
      'holdDeposits',
      'priceChangePercent24hr',
    ],
    additionalProperties: false,
  },
};

export const walletPerformanceResponseSchema: JSONSchemaType<{
  graph: Record<string, number>[];
  finalBalance: number;
  balanceChange: number;
  balanceChangePercentage: string;
}> = {
  type: 'object',
  properties: {
    graph: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          timestamp: {
            type: 'number',
          },
          balance: {
            type: 'number',
          },
        },
        required: ['timestamp', 'balance'],
        additionalProperties: false,
      },
    },
    finalBalance: {
      type: 'number',
    },
    balanceChange: {
      type: 'number',
    },
    balanceChangePercentage: {
      type: 'string',
    },
  },
  required: [
    'graph',
    'finalBalance',
    'balanceChange',
    'balanceChangePercentage',
  ],
  additionalProperties: false,
};

export const walletNetworthResponseSchema: JSONSchemaType<{
  totalFiatAmount: number;
  totalCryptoAmount: number;
  totalNetworth: number;
  cryptoPercentage: number;
  fiatPercentage: number;
}> = {
  type: 'object',
  properties: {
    totalFiatAmount: {
      type: 'number',
    },
    totalCryptoAmount: {
      type: 'number',
    },
    totalNetworth: {
      type: 'number',
    },
    cryptoPercentage: {
      type: 'number',
    },
    fiatPercentage: {
      type: 'number',
    },
  },
  required: [
    'totalFiatAmount',
    'totalCryptoAmount',
    'totalNetworth',
    'cryptoPercentage',
    'fiatPercentage',
  ],
  additionalProperties: false,
};
