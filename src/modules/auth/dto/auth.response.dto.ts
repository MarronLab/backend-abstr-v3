import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export default class AuthResponseDto {
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
