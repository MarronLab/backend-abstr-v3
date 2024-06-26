import { JSONSchemaType } from 'ajv';

export const getAllTransactionsResponseSchema: JSONSchemaType<{
  pageInfo: {
    totalRows: number;
    currentPage: number;
    pageSize: number;
  };
  result: {
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
    pgName: null | string;
    memo: null | string;
    isPassedTravelRule: boolean;
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
          'requestDate',
          'amount',
          'equivalentUsdAmt',
          'currency',
          'transactionID',
          'rejectReason',
          'comments',
          'status',
          'type',
          'currentTxnCount',
          'requiredTxnCount',
          'explorerURL',
          'confirmDate',
          'address',
          'fee',
          'pgName',
          'memo',
          'isPassedTravelRule',
        ],
        properties: {
          requestDate: { type: 'string' },
          amount: { type: 'number' },
          equivalentUsdAmt: { type: 'number' },
          currency: { type: 'string' },
          transactionID: { type: 'string' },
          rejectReason: {
            type: 'string',
            nullable: true as false,
          },
          comments: { type: 'string', nullable: true as false },
          status: { type: 'string', nullable: true as false },
          type: { type: 'string' },
          currentTxnCount: { type: 'number' },
          requiredTxnCount: { type: 'number' },
          explorerURL: { type: 'string' },
          confirmDate: { type: 'string' },
          address: { type: 'string' },
          fee: { type: 'number' },
          pgName: { type: 'string', nullable: true as false },
          memo: { type: 'string', nullable: true as false },
          isPassedTravelRule: { type: 'boolean' },
        },
      },
    },
  },
};
