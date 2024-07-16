import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsDefined, IsNotEmpty } from 'class-validator';

export default class VerifyChangeEmailOtpDto {
  @ApiProperty({
    description: 'The OTP sent to the new email',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  newEmailOtp: string;

  @ApiProperty({
    description: 'The OTP sent to the old email',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  oldEmailOtp: string;
}
