import { JSONSchemaType } from 'ajv';
import {
  OrderSideEnum,
  OrderTypeEnum,
} from 'src/services/modulus/modulus.enum';

export const placeOrderResponseSchema: JSONSchemaType<{
  id: number;
  side: OrderSideEnum;
  type: OrderTypeEnum;
  size: number;
  filled: number;
  remaining: number;
  price: number;
  filledPrice: number;
  metadata: string;
}> = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    side: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    size: {
      type: 'number',
    },
    filled: {
      type: 'number',
    },
    remaining: {
      type: 'number',
    },
    price: {
      type: 'number',
    },
    filledPrice: {
      type: 'number',
    },
    metadata: {
      type: 'string',
    },
  },
  required: [
    'id',
    'size',
    'price',
    'side',
    'type',
    'filled',
    'remaining',
    'filledPrice',
    'metadata',
  ],
  additionalProperties: false,
};

export const placeOrderPricedResponseSchema: JSONSchemaType<{
  id: number;
  side: OrderSideEnum;
  type: OrderTypeEnum;
  size: number;
  filled: number;
  remaining: number;
  price: number;
  filledPrice: number;
  metadata: string;
}> = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    side: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    size: {
      type: 'number',
    },
    filled: {
      type: 'number',
    },
    remaining: {
      type: 'number',
    },
    price: {
      type: 'number',
    },
    filledPrice: {
      type: 'number',
    },
    metadata: {
      type: 'string',
    },
  },
  required: [
    'id',
    'side',
    'type',
    'size',
    'filled',
    'remaining',
    'price',
    'filledPrice',
    'metadata',
  ],
  additionalProperties: false,
};

export const cancelOrderResponseSchema: JSONSchemaType<{
  id: number;
  et: number;
  etm: number;
}> = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    et: {
      type: 'number',
    },
    etm: {
      type: 'number',
    },
  },
  required: ['id', 'et', 'etm'],
  additionalProperties: false,
};
