import { JSONSchemaType } from 'ajv';

export const getProfileResponseSchema: JSONSchemaType<{
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  loginName: string;
  joinedOn: string;
  is2FAEnabled: boolean;
  isMobileVerified: boolean;
  kycStatus: string;
  kycApprovedBy: null | string;
  country: string;
  mobileNumber: string;
  kycRejectReason: string;
  kycRequestInfo: string;
  kycApprovedLevel: null | string;
  currentStatus: null | string;
  isUserBlocked: boolean;
  corporateName: string;
  priceChangeAlert: boolean;
  priceChangePercentage: string;
  discounts: {
    tokenDiscount: number;
    feeGroups: number;
    volumeDiscount: number;
    totalDiscount: number;
  };
  customFields: string[];
  kycType: string;
}> = {
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
  },
};

export const generateSafeAddressResponseSchema: JSONSchemaType<{
  safeAddress: string;
  isSafeDeployed: boolean;
  initCode: string;
}> = {
  type: 'object',
  additionalProperties: false,
  required: ['safeAddress', 'isSafeDeployed', 'initCode'],
  properties: {
    safeAddress: { type: 'string' },
    isSafeDeployed: { type: 'boolean' },
    initCode: { type: 'string' },
  },
};
