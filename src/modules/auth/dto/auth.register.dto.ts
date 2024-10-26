import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export default class RegisterDto {
  // @ApiProperty({
  //   description: 'The email address of the user',
  //   required: false,
  // })
  // @IsString()
  // @IsEmail()
  // email: string;

  // @ApiProperty({
  //   description: 'The password for the user account',
  //   required: false,
  // })
  // @IsString()
  // password: string;

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
    description: 'The wallet address',
    required: true,
  })
  @IsString()
  walletAddress: string;
}
