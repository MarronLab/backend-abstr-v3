import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export default class ChangePasswordDto {
  @ApiProperty({
    description: 'The old password of the user',
    required: true,
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password for the user',
    required: true,
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  newPassword: string;

  @ApiPropertyOptional({
    description: 'The otp from the email',
  })
  @IsString()
  otp?: string;
}
