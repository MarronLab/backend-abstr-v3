import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested } from 'class-validator';

export class AuthAccessTokenResponseDto {
  @ApiProperty({
    description: 'Access token',
    required: true,
  })
  @IsString()
  access_token: string;

  @ApiProperty({
    description: 'Token type',
    required: true,
  })
  @IsString()
  token_type: string;

  @ApiProperty({
    description: 'Indicates if the login was successful',
    required: true,
  })
  @IsNumber()
  expires_in: number;
}

export class AuthVerificationResponseDto {
  @ApiProperty({
    description: 'Auth login token',
    required: true,
  })
  @IsString()
  tempAuthToken: string;

  @ApiProperty({
    description: 'Token expiry date',
    required: true,
  })
  @IsString()
  tokenExpiry: string;

  @ApiProperty({
    description: '2FA method',
    required: true,
  })
  @IsNumber()
  twoFAMehtod: number;
}

export default class AuthResponseDto {
  @ApiProperty({
    description: '2FA method',
    required: true,
    oneOf: [
      { $ref: getSchemaPath(AuthAccessTokenResponseDto) },
      { $ref: getSchemaPath(AuthVerificationResponseDto) },
    ],
  })
  @ValidateNested()
  @Type(() => AuthAccessTokenResponseDto, {
    discriminator: {
      property: '__type',
      subTypes: [
        {
          value: AuthAccessTokenResponseDto,
          name: 'AuthAccessTokenResponseDto',
        },
        {
          value: AuthVerificationResponseDto,
          name: 'AuthVerificationResponseDto',
        },
      ],
    },
  })
  data: AuthAccessTokenResponseDto | AuthVerificationResponseDto;
}
