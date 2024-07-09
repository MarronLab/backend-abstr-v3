import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export default class SignupResendEmailDto {
  @ApiProperty({
    description: 'The email address of the user',
    required: true,
  })
  @IsString()
  @IsEmail()
  email: string;
}
