import { JSONSchemaType } from 'ajv';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

export const errorResponseSchema: JSONSchemaType<ErrorResponse> = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    message: { type: 'string' },
    error: { type: 'string' },
  },
  required: ['statusCode', 'message', 'error'],
  additionalProperties: false,
};
