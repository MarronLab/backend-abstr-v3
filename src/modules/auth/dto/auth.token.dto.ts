import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export default class TokenDto {
  @ApiProperty({
    description: 'The login grant type e.g password',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  grantType: string;

  @ApiProperty({
    description: 'The tempAuthToken provided as login response',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The otp from the email or gauth',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}
