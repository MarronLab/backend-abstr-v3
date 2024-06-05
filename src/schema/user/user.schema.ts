import { JSONSchemaType } from 'ajv';

export const getSafeAddressSchema: JSONSchemaType<{ userAddress: string }> = {
  type: 'object',
  properties: {
    userAddress: {
      type: 'string',
    },
  },
  required: ['userAddress'],
  additionalProperties: false,
};
