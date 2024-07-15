import { ApiProperty } from '@nestjs/swagger';

export default class GetGoogleAuthenticatorEnableResponseDto {
  @ApiProperty({
    description: 'The status of the response',
  })
  pairingCode: string;

  @ApiProperty({
    description: 'The message accompanying the response',
  })
  qRCode: string;

  constructor(partial: Partial<GetGoogleAuthenticatorEnableResponseDto>) {
    Object.assign(this, partial);
  }
}
