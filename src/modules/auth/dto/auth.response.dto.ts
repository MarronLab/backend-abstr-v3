import { ApiProperty, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class AuthAccessTokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: 'Access token',
    required: true,
  })
  @IsString()
  access_token: string;

  @ApiProperty({
    example: 'Bearer',
    description: 'Token type',
    required: true,
  })
  @IsString()
  token_type: string;

  @ApiProperty({
    example: 3600,
    description: 'Indicates if the login was successful',
    required: true,
  })
  @IsNumber()
  expires_in: number;
}

export class AuthVerificationResponseDto {
  @ApiProperty({
    example: 'c470cb47-fa28-48e5-97e9-fc5db11abcdf',
    description: 'Auth login token',
    required: true,
  })
  @IsString()
  tempAuthToken: string;

  @ApiProperty({
    example: '2024-08-13T20:40:42.8075247Z',
    description: 'Token expiry date',
    required: true,
  })
  @IsString()
  tokenExpiry: string;

  @ApiProperty({
    example: 'Email',
    description: '2FA method',
    required: true,
  })
  @IsNumber()
  twoFAMehtod: number;
}

@ApiExtraModels(AuthAccessTokenResponseDto, AuthVerificationResponseDto)
export default class AuthResponseDto {
  @ApiProperty({
    description: '2FA method',
    required: true,
    oneOf: [
      { $ref: getSchemaPath(AuthAccessTokenResponseDto) },
      { $ref: getSchemaPath(AuthVerificationResponseDto) },
    ],
  })
  data: AuthAccessTokenResponseDto | AuthVerificationResponseDto;
}
