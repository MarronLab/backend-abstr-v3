import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateProfileRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstname?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  middlename?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastname?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mobile?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  emailAnnouncements?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  emailNewsletter?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  emailTradeUpdates?: boolean;
}
