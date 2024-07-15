import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export default class EnableGoogleAuthenticatorDto {
  @ApiProperty({
    description: 'The Google Authenticator code',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  code: string;
}
