import { JSONSchemaType } from 'ajv';

export const getSettingsResponseSchema: JSONSchemaType<{
  server_Time_UTC: string;
  client_IP: string;
  client_Country: string;
  default_Pair: string;
  disable_RM: string;
  disable_TDM: string;
  enable_TDM_Pay_IN_Exchange_Token: string;
  disable_2FA: string;
  disable_Login: string;
  enable_AeraPass: string;
  enable_InstaTrade: string;
  enable_CopyTrade: string;
  enable_SecurityTokens: string;
  enable_PhoneVerification: string;
  enable_P2P_Trading: string;
  enable_SocialTrade: string;
  enable_CryptoFeatures: boolean;
  auto_Sell: string;
  enable_CryptoForecasting: string;
  enable_Simplex: string;
  aeraPass_Url: string;
  logo_Url: string;
  favIcon_Url: string;
  navBarLogo_Url: string;
  fiat_List: string;
  exchange_IEO_Coins: string;
  withdrawals_Forced_2FA: string;
  mfa_Type: {
    name: string;
    codeLength: number;
    downloadLink: string;
  };
  _CoName: string;
  exchangeName: string;
  _xrp_address: string;
  tdM_Token_Name: string;
  enable_DustConversion: string;
  exchange_SupportDesk_URL: string;
}> = {
  type: 'object',
  properties: {
    server_Time_UTC: { type: 'string' },
    client_IP: { type: 'string' },
    client_Country: { type: 'string' },
    default_Pair: { type: 'string' },
    disable_RM: { type: 'string' },
    disable_TDM: { type: 'string' },
    enable_TDM_Pay_IN_Exchange_Token: { type: 'string' },
    disable_2FA: { type: 'string' },
    disable_Login: { type: 'string' },
    enable_AeraPass: { type: 'string' },
    enable_InstaTrade: { type: 'string' },
    enable_CopyTrade: { type: 'string' },
    enable_SecurityTokens: { type: 'string' },
    enable_PhoneVerification: { type: 'string' },
    enable_P2P_Trading: { type: 'string' },
    enable_SocialTrade: { type: 'string' },
    enable_CryptoFeatures: { type: 'boolean' },
    auto_Sell: { type: 'string' },
    enable_CryptoForecasting: { type: 'string' },
    enable_Simplex: { type: 'string' },
    aeraPass_Url: { type: 'string' },
    logo_Url: { type: 'string' },
    favIcon_Url: { type: 'string' },
    navBarLogo_Url: { type: 'string' },
    fiat_List: { type: 'string' },
    exchange_IEO_Coins: { type: 'string' },
    withdrawals_Forced_2FA: { type: 'string' },
    mfa_Type: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        codeLength: { type: 'number' },
        downloadLink: { type: 'string' },
      },
      required: ['name', 'codeLength', 'downloadLink'],
    },
    _CoName: { type: 'string' },
    exchangeName: { type: 'string' },
    _xrp_address: { type: 'string' },
    tdM_Token_Name: { type: 'string' },
    enable_DustConversion: { type: 'string' },
    exchange_SupportDesk_URL: { type: 'string' },
  },
  required: [
    'server_Time_UTC',
    'client_IP',
    'client_Country',
    'default_Pair',
    'disable_RM',
    'disable_TDM',
    'enable_TDM_Pay_IN_Exchange_Token',
    'disable_2FA',
    'disable_Login',
    'enable_AeraPass',
    'enable_InstaTrade',
    'enable_CopyTrade',
    'enable_SecurityTokens',
    'enable_PhoneVerification',
    'enable_P2P_Trading',
    'enable_SocialTrade',
    'enable_CryptoFeatures',
    'auto_Sell',
    'enable_CryptoForecasting',
    'enable_Simplex',
    'aeraPass_Url',
    'logo_Url',
    'favIcon_Url',
    'navBarLogo_Url',
    'fiat_List',
    'exchange_IEO_Coins',
    'withdrawals_Forced_2FA',
    'mfa_Type',
    '_CoName',
    'exchangeName',
    '_xrp_address',
    'tdM_Token_Name',
    'enable_DustConversion',
    'exchange_SupportDesk_URL',
  ],
  additionalProperties: false,
};
