import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export default class ResendEmailOtpDto {
  @ApiProperty({
    description: 'The tempAuthToken provided as login response',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  token: string;
}
