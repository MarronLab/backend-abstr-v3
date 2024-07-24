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

export const getGoogleAuthenticatorEnableResponseSchema: JSONSchemaType<{
  pairingCode: string;
  qRCode: string;
}> = {
  type: 'object',
  properties: {
    pairingCode: {
      type: 'string',
    },
    qRCode: {
      type: 'string',
    },
  },
  required: ['pairingCode', 'qRCode'],
  additionalProperties: false,
};

export const getWhiteListedDevicesDataSchema: JSONSchemaType<{
  id: number;
  deviceID: string;
  browser: string;
  os: string;
  device: string;
  ip: string;
  addedOn: string;
}> = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    deviceID: {
      type: 'string',
    },
    browser: {
      type: 'string',
    },
    os: {
      type: 'string',
    },
    device: {
      type: 'string',
    },
    ip: {
      type: 'string',
    },
    addedOn: {
      type: 'string',
    },
  },
  required: ['id', 'deviceID', 'browser', 'os', 'device', 'ip', 'addedOn'],
  additionalProperties: false,
};

export const getWhiteListedDevicesResponseSchema: JSONSchemaType<{
  status: string;
  message: string;
  data: {
    id: number;
    deviceID: string;
    browser: string;
    os: string;
    device: string;
    ip: string;
    addedOn: string;
  }[];
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
      type: 'array',
      items: getWhiteListedDevicesDataSchema,
    },
  },
  required: ['status', 'message', 'data'],
  additionalProperties: false,
};
