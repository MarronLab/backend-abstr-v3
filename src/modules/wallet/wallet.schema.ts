import { JSONSchemaType } from 'ajv';

export const getBalancesResponseSchema: JSONSchemaType<
  {
    currency: string;
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
