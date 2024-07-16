import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsDefined, IsNotEmpty } from 'class-validator';

export default class ChangeEmailDto {
  @ApiProperty({
    description: 'The new user email to change to',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
