import { JSONSchemaType } from 'ajv';

export const getAllNotificationsResponseSchema: JSONSchemaType<{
  pageInfo: {
    totalRows: number;
    currentPage: number;
    pageSize: number;
  };
  result: {
    id: number;
    cid: number;
    messageTitle: string;
    messageBody: string;
    addedOn: string;
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
        required: ['id', 'cid', 'messageBody', 'messageTitle', 'addedOn'],
        properties: {
          id: { type: 'number' },
          cid: { type: 'number' },
          messageTitle: { type: 'string' },
          messageBody: { type: 'string' },
          addedOn: { type: 'string' },
        },
      },
    },
  },
};
