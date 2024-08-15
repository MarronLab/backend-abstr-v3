import { JSONSchemaType } from 'ajv';

export const getAllTransactionsResponseSchema: JSONSchemaType<{
  cursor: string;
  page: number;
  pageSize: number;
  result: {
    hash: string;
    nonce: string;
    transactionIndex: string;
    fromAddressEntity: null | string;
    fromAddressEntityLogo: null | string;
    fromAddress: string;
    fromAddressLabel: null | string;
    toAddressEntity: null | string;
    toAddressEntityLogo: null | string;
    toAddress: string;
    toAddressLabel: null | string;
    value: string;
    gas: string;
    gasPrice: string;
    input: string;
    receiptCumulativeGasUsed: string;
    receiptGasUsed: string;
    receiptContractAddress: null | string;
    receiptRoot: null | string;
    receiptStatus: string;
    transactionFee: string;
    blockTimestamp: string;
    blockNumber: string;
    blockHash: string;
  }[];
}> = {
  type: 'object',
  additionalProperties: false,
  required: ['cursor', 'page', 'pageSize', 'result'],
  properties: {
    cursor: {
      type: 'string',
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
          'nonce',
          'transactionIndex',
          'fromAddressEntity',
          'fromAddressEntityLogo',
          'fromAddress',
          'fromAddressLabel',
          'toAddressEntity',
          'toAddressEntityLogo',
          'toAddress',
          'toAddressLabel',
          'value',
          'gas',
          'gasPrice',
          'input',
          'receiptCumulativeGasUsed',
          'receiptGasUsed',
          'receiptContractAddress',
          'receiptRoot',
          'receiptStatus',
          'transactionFee',
          'blockTimestamp',
          'blockNumber',
          'blockHash',
        ],
        properties: {
          hash: { type: 'string' },
          nonce: { type: 'string' },
          transactionIndex: { type: 'string' },
          fromAddressEntity: { type: 'string', nullable: true as false },
          fromAddressEntityLogo: { type: 'string', nullable: true as false },
          fromAddress: { type: 'string' },
          fromAddressLabel: { type: 'string', nullable: true as false },
          toAddressEntity: { type: 'string', nullable: true as false },
          toAddressEntityLogo: { type: 'string', nullable: true as false },
          toAddress: {
            type: 'string',
            nullable: true as false,
          },
          toAddressLabel: { type: 'string', nullable: true as false },
          value: { type: 'string' },
          gas: { type: 'string' },
          gasPrice: { type: 'string' },
          input: { type: 'string' },
          receiptCumulativeGasUsed: { type: 'string' },
          receiptGasUsed: { type: 'string' },
          receiptContractAddress: { type: 'string', nullable: true as false },
          receiptRoot: { type: 'string', nullable: true as false },
          receiptStatus: { type: 'string' },
          transactionFee: { type: 'string' },
          blockTimestamp: { type: 'string' },
          blockNumber: { type: 'string' },
          blockHash: { type: 'string' },
        },
      },
    },
  },
};
