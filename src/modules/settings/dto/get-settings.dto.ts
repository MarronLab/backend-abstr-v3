import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class MfaTypeDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  codeLength: number;

  @ApiProperty()
  downloadLink: string;

  constructor(partial: Partial<MfaTypeDto>) {
    Object.assign(this, partial);
  }
}

export class GetSettingsResponseDto {
  @ApiProperty()
  server_Time_UTC: string;

  @ApiProperty()
  client_IP: string;

  @ApiProperty()
  client_Country: string;

  @ApiProperty()
  default_Pair: string;

  @ApiProperty()
  disable_RM: string;

  @ApiProperty()
  disable_TDM: string;

  @ApiProperty()
  enable_TDM_Pay_IN_Exchange_Token: string;

  @ApiProperty()
  disable_2FA: string;

  @ApiProperty()
  disable_Login: string;

  @ApiProperty()
  enable_AeraPass: string;

  @ApiProperty()
  enable_InstaTrade: string;

  @ApiProperty()
  enable_CopyTrade: string;

  @ApiProperty()
  enable_SecurityTokens: string;

  @ApiProperty()
  enable_PhoneVerification: string;

  @ApiProperty()
  enable_P2P_Trading: string;

  @ApiProperty()
  enable_SocialTrade: string;

  @ApiProperty()
  enable_CryptoFeatures: boolean;

  @ApiProperty()
  auto_Sell: string;

  @ApiProperty()
  enable_CryptoForecasting: string;

  @ApiProperty()
  enable_Simplex: string;

  @ApiProperty()
  aeraPass_Url: string;

  @ApiProperty()
  logo_Url: string;

  @ApiProperty()
  favIcon_Url: string;

  @ApiProperty()
  navBarLogo_Url: string;

  @ApiProperty()
  fiat_List: string;

  @ApiProperty()
  exchange_IEO_Coins: string;

  @ApiProperty()
  withdrawals_Forced_2FA: string;

  @ApiProperty({ type: MfaTypeDto })
  @Type(() => MfaTypeDto)
  mfa_Type: MfaTypeDto;

  @ApiProperty()
  _CoName: string;

  @ApiProperty()
  exchangeName: string;

  @ApiProperty()
  _xrp_address: string;

  @ApiProperty()
  tdM_Token_Name: string;

  @ApiProperty()
  enable_DustConversion: string;

  @ApiProperty()
  exchange_SupportDesk_URL: string;

  constructor(partial: Partial<GetSettingsResponseDto>) {
    Object.assign(this, partial);
  }
}
