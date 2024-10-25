import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export default class LoginDto {
  @ApiProperty({
    description: 'The user email',
    required: false,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The user password',
    required: false,
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

  @ApiProperty({
    description: 'The Address',
    required: true,
  })
  @IsString()
  address: string;
}
