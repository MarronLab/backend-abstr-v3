import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class ForgotPasswordOtpRequestDto {
  @ApiPropertyOptional({
    description: 'The captcha code',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  captchaCode?: string;

  @ApiProperty({
    description: 'The user email',
    required: true,
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    description: 'The user mobile number country code',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  countryCode?: string;

  @ApiProperty({
    description: 'The user mobile number',
  })
  @IsString()
  @IsDefined()
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
