import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class ForgotPasswordOtpRequestDto {
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
}

export class ForgotPasswordOtpResponseDto {
  @ApiProperty()
  emailToken: string;

  @ApiProperty()
  smsToken: string;

  constructor(partial: Partial<ForgotPasswordOtpResponseDto>) {
    Object.assign(this, partial);
  }
}
