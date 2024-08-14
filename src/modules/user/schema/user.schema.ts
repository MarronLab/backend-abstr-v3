import { JSONSchemaType } from 'ajv';
import {
  GenerateSafeAddressResponseSchemaType,
  GetProfileResponseSchemaType,
} from './user.schema.type';

import {
  GetSaveFavoriteCoinMarketData,
  GetSaveFavoriteCoinsResponseData,
} from 'src/services/coingecko/coingecko.type';

export const getProfileResponseSchema: JSONSchemaType<GetProfileResponseSchemaType> =
  {
    type: 'object',
    additionalProperties: false,
    required: [
      'id',
      'firstName',
      'middleName',
      'lastName',
      'email',
      'loginName',
      'joinedOn',
      'is2FAEnabled',
      'isMobileVerified',
      'kycStatus',
      'kycApprovedBy',
      'country',
      'mobileNumber',
      'priceChangePercentage',
      'priceChangeAlert',
      'isUserBlocked',
      'kycApprovedLevel',
      'kycRejectReason',
      'kycRequestInfo',
      'kycType',
      'customFields',
      'corporateName',
      'discounts',
      'currentStatus',
      'language',
      'currency',
      'timezone',
      'username',
      'safeAddress',
      'userAddress',
      'emailNewsletter',
      'emailTradeUpdates',
      'emailAnnouncements',
      'publicID',
      'autoLogoutDuration',
      'lastLoggedInAt',
      'modulusCustomerEmail',
    ],
    properties: {
      id: { type: 'number' },
      firstName: { type: 'string' },
      middleName: { type: 'string' },
      lastName: { type: 'string' },
      email: { type: 'string' },
      loginName: { type: 'string' },
      joinedOn: { type: 'string' },
      is2FAEnabled: { type: 'boolean' },
      isMobileVerified: { type: 'boolean' },
      kycStatus: { type: 'string' },
      kycApprovedBy: { type: 'string', nullable: true as false },
      country: { type: 'string' },
      mobileNumber: { type: 'string' },
      kycRejectReason: { type: 'string' },
      kycRequestInfo: { type: 'string' },
      kycApprovedLevel: { type: 'string', nullable: true as false },
      currentStatus: { type: 'string', nullable: true as false },
      isUserBlocked: { type: 'boolean' },
      corporateName: { type: 'string' },
      priceChangeAlert: { type: 'boolean' },
      priceChangePercentage: { type: 'string' },
      customFields: { type: 'array', items: { type: 'string' } },
      kycType: { type: 'string' },
      discounts: {
        type: 'object',
        required: [
          'volumeDiscount',
          'totalDiscount',
          'tokenDiscount',
          'feeGroups',
        ],
        properties: {
          feeGroups: { type: 'number' },
          tokenDiscount: { type: 'number' },
          totalDiscount: { type: 'number' },
          volumeDiscount: { type: 'number' },
        },
        additionalProperties: false,
      },
      language: { type: 'string', nullable: true as false },
      currency: { type: 'string', nullable: true as false },
      timezone: { type: 'string', nullable: true as false },
      username: { type: 'string', nullable: true as false },
      userAddress: { type: 'string' },
      safeAddress: { type: 'string' },
      emailAnnouncements: { type: 'boolean' },
      emailTradeUpdates: { type: 'boolean' },
      emailNewsletter: { type: 'boolean' },
      publicID: { type: 'string' },
      autoLogoutDuration: { type: 'number', nullable: true as false },
      lastLoggedInAt: { type: 'object' },
      modulusCustomerEmail: { type: 'string' },
    },
  };

export const generateSafeAddressResponseSchema: JSONSchemaType<GenerateSafeAddressResponseSchemaType> =
  {
    type: 'object',
    additionalProperties: false,
    required: ['safeAddress', 'isSafeDeployed', 'initCode'],
    properties: {
      safeAddress: { type: 'string' },
      isSafeDeployed: { type: 'boolean' },
      initCode: { type: 'string' },
    },
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

export const saveFavoriteCoinsResponseSchema: JSONSchemaType<{
  status: 'Success' | 'Error';
  message: string;
  data: string | null;
}> = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['Success', 'Error'],
    },
    message: {
      type: 'string',
    },
    data: { type: 'string', nullable: true as any },
  },
  required: ['status', 'message', 'data'],
  additionalProperties: false,
};

export const coinMarketDataSchema: JSONSchemaType<GetSaveFavoriteCoinMarketData> =
  {
    type: 'object',
    additionalProperties: false,
    required: [
      'id',
      'symbol',
      'name',
      'image',
      'current_price',
      'price_change_percentage_24h',
      'price_change_24h',
      'market_cap_rank',
      'high_24h',
      'low_24h',
    ],
    properties: {
      id: { type: 'string' },
      symbol: { type: 'string' },
      name: { type: 'string' },
      image: { type: 'string' },
      current_price: { type: 'number' },
      price_change_percentage_24h: { type: 'number' },
      price_change_24h: { type: 'number' },
      market_cap_rank: { type: 'number' },
      high_24h: { type: 'number' },
      low_24h: { type: 'number' },
    },
  };

export const getSaveFavoriteCoinsResponseSchema: JSONSchemaType<GetSaveFavoriteCoinsResponseData> =
  {
    type: 'object',
    additionalProperties: false,
    required: ['status', 'message', 'data'],
    properties: {
      status: { type: 'string' },
      message: { type: 'string' },
      data: {
        type: 'array',
        items: coinMarketDataSchema,
      },
    },
  };
