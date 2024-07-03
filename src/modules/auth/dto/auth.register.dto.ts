import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export default class RegisterDto {
  @ApiProperty({
    description: 'The email address of the user',
    required: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    required: true,
  })
  @IsString()
  password: string;
}
