import { JSONSchemaType } from 'ajv';

export const listApiKeyResponseSchema: JSONSchemaType<
  {
    key: string;
    type: string;
    trustedIPs: string;
    generatedOn: string;
    lastHit: null | string;
    account: string;
  }[]
> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      key: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
      trustedIPs: {
        type: 'string',
      },
      generatedOn: {
        type: 'string',
      },
      lastHit: {
        type: 'string',
        nullable: true as false, // this is a workaround for ajv to accept null without typescript complaining
      },
      account: {
        type: 'string',
      },
    },
    required: [
      'key',
      'type',
      'trustedIPs',
      'generatedOn',
      'lastHit',
      'account',
    ],
    additionalProperties: false,
  },
};

export const generateApiKeyResponseSchema: JSONSchemaType<{
  publicKey: string;
  privateKey: string;
}> = {
  type: 'object',
  properties: {
    publicKey: {
      type: 'string',
    },
    privateKey: {
      type: 'string',
    },
  },
  required: ['publicKey', 'privateKey'],
  additionalProperties: false,
};
