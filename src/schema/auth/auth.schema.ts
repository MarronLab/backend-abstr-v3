import { JSONSchemaType } from 'ajv';
import { RegisterRequest } from 'src/services/modulus/modulus.type';

export const registerResponseSchema: JSONSchemaType<RegisterRequest> = {
  type: 'object',
  properties: {
    firstname: {
      type: 'string',
    },
    middlename: {
      type: 'string',
    },
    lastname: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
    mobile: {
      type: 'string',
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
    },
  },
  required: [
    'firstname',
    'middlename',
    'lastname',
    'email',
    'country',
    'mobile',
    'password',
    'mobileOTP',
  ],
  additionalProperties: false,
};
