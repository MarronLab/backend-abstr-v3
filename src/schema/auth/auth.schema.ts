import { JSONSchemaType } from 'ajv';

export const registerResponseSchema: JSONSchemaType<{
  status: string;
  message: string;
  data: string;
}> = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
    },
    message: {
      type: 'string',
    },
    data: {
      type: 'string',
    },
  },
  required: ['status', 'message', 'data'],
  additionalProperties: false,
};
