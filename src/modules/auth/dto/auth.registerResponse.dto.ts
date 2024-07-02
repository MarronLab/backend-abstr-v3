import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class RegisterResponseDto {
  @ApiPropertyOptional()
  firstname?: string;

  @ApiPropertyOptional()
  middlename?: string;

  @ApiPropertyOptional()
  lastname?: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  mobile?: string;

  @Exclude()
  password: string;

  @ApiPropertyOptional()
  referralId?: number;

  @ApiPropertyOptional()
  mobileOTP?: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
