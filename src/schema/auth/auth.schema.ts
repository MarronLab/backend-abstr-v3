import { JSONSchemaType } from 'ajv';
import { RegisterRequest } from 'src/services/modulus/modulus.type';

export const registerResponseSchema: JSONSchemaType<RegisterRequest> = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};
