import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class ForgotPasswordRequestDto {
  @ApiProperty({
    description: 'The user email',
    required: true,
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  email: string;

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
}
