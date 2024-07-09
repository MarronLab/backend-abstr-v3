import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class VerifyAccountDto {
  @ApiProperty({
    description: 'The otp from the mail',
    required: true,
  })
  @IsString()
  otp: string;
}
