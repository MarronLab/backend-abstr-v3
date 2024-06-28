import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export default class RegisterDto {
  @ApiProperty({
    description: 'The first name of the user',
    required: true,
  })
  @IsOptional()
  @IsString()
  firstname: string;

  @ApiProperty({
    description: 'The middle name of the user',
  })
  @IsOptional()
  @IsString()
  middlename: string;

  @ApiProperty({
    description: 'The last name of the user',
    required: true,
  })
  @IsOptional()
  @IsString()
  lastname: string;

  @ApiProperty({
    description: 'The email address of the user',
    required: true,
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'TThe country of residence of the user',
    required: true,
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'The mobile phone number of the user',
    required: true,
  })
  @IsOptional()
  @IsString()
  mobile: string;

  @ApiProperty({
    description: 'The password for the user account',
    required: true,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The referral ID, if any',
  })
  @IsOptional()
  @IsString()
  referralId: string;

  @ApiProperty({
    description: 'The mobile OTP for verification',
    required: true,
  })
  @IsOptional()
  @IsString()
  mobileOTP: string;
}
