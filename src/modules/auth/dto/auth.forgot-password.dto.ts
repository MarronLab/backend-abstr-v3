import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional({
    description: 'The user email',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'The user mobile number country code',
  })
  @IsString()
  @IsNotEmpty()
  countryCode?: string;

  @ApiPropertyOptional({
    description: 'The user mobile number',
  })
  @IsString()
  @IsNotEmpty()
  mobile?: string;

  @ApiProperty({
    description: 'The new password',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiPropertyOptional({
    description: 'The email token',
  })
  @IsString()
  @IsNotEmpty()
  emailToken?: string;

  @ApiPropertyOptional({
    description: 'The email otp',
  })
  @IsString()
  @IsNotEmpty()
  emailOtp?: string;

  @ApiPropertyOptional({
    description: 'The sms token',
  })
  @IsString()
  @IsNotEmpty()
  smsToken?: string;

  @ApiPropertyOptional({
    description: 'The sms otp',
  })
  @IsString()
  @IsNotEmpty()
  smsOtp?: string;
}
