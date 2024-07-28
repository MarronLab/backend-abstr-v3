import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class ForgotPasswordOtpRequestDto {
  @ApiProperty({
    description: 'The user email',
    required: true,
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  email: string;
}

export class ForgotPasswordOtpResponseDto {
  @ApiProperty()
  emailToken: string;

  constructor(partial: Partial<ForgotPasswordOtpResponseDto>) {
    Object.assign(this, partial);
  }
}
