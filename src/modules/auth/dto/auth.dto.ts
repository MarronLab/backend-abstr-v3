import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export default class LoginDto {
  @ApiProperty({
    description: 'The user email',
    required: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The user password',
    required: true,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The nonce',
    required: true,
  })
  @IsString()
  nonce: string;

  @ApiProperty({
    description: 'The signature',
    required: true,
  })
  @IsString()
  signature: string;
}
