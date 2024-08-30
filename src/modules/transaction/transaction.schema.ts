import { JSONSchemaType } from 'ajv';

export const getAllTransactionsResponseSchema: JSONSchemaType<{
  cursor: string;
  page: number;
  pageSize: number;
  result: {
    hash: string;
    tokenSymbol: string;
    value: number;
    receiptStatus: string;
    blockTimestamp: string;
    type: string;
    direction: string;
  }[];
}> = {
  type: 'object',
  additionalProperties: false,
  required: ['cursor', 'page', 'pageSize', 'result'],
  properties: {
    cursor: {
      type: 'string',
      nullable: true as false,
    },
    page: {
      type: 'number',
    },
    pageSize: {
      type: 'number',
    },
    result: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'hash',
          'tokenSymbol',
          'direction',
          'type',
          'value',
          'receiptStatus',
          'blockTimestamp',
        ],
        properties: {
          hash: { type: 'string' },
          tokenSymbol: { type: 'string' },
          direction: { type: 'string' },
          type: { type: 'string' },
          value: { type: 'number' },
          receiptStatus: { type: 'string' },
          blockTimestamp: { type: 'string' },
        },
      },
    },
  },
};
