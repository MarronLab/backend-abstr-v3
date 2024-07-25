import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class ForgotPasswordRequestDto {
  @ApiProperty({
    description: 'The captcha code',
    required: true,
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  captchaCode: string;

  @ApiProperty({
    description: 'The user email',
    required: true,
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The user mobile number country code',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({
    description: 'The user mobile number',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({
    description: 'The new password',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: 'The email token',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  emailToken: string;

  @ApiProperty({
    description: 'The email otp',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  emailOtp: string;

  @ApiProperty({
    description: 'The sms token',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  smsToken: string;

  @ApiProperty({
    description: 'The sms otp',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  smsOtp: string;
}
