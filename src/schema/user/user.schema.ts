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

export const getSafeAddressResponseSchema: JSONSchemaType<{
  safeAddress: string;
  isSafeDeployed: boolean;
  initCode: string;
}> = {
  type: 'object',
  properties: {
    safeAddress: {
      type: 'string',
    },
    isSafeDeployed: {
      type: 'boolean',
    },
    initCode: {
      type: 'string',
    },
  },
  required: ['safeAddress', 'isSafeDeployed', 'initCode'],
  additionalProperties: false,
};
