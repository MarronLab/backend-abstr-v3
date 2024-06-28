import { JSONSchemaType } from 'ajv';
import { RegisterRequest } from 'src/services/modulus/modulus.type';

export const registerResponseSchema: JSONSchemaType<RegisterRequest> = {
  type: 'object',
  properties: {
    firstname: {
      type: 'string',
      nullable: true,
    },
    middlename: {
      type: 'string',
      nullable: true,
    },
    lastname: {
      type: 'string',
      nullable: true,
    },
    email: {
      type: 'string',
    },
    country: {
      type: 'string',
      nullable: true,
    },
    mobile: {
      type: 'string',
      nullable: true,
    },
    password: {
      type: 'string',
    },
    referralId: {
      type: 'string',
      nullable: true,
    },
    mobileOTP: {
      type: 'string',
      nullable: true,
    },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};
