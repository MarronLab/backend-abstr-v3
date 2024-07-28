import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileRequestDto {
  @ApiPropertyOptional()
  firstname?: string;

  @ApiPropertyOptional()
  middlename?: string;

  @ApiPropertyOptional()
  lastname?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  mobile?: string;

  @ApiPropertyOptional()
  timezone?: string;

  @ApiPropertyOptional()
  currency?: string;

  @ApiPropertyOptional()
  language?: string;

  @ApiPropertyOptional()
  emailAnnouncements?: boolean;

  @ApiPropertyOptional()
  emailNewsletter?: boolean;

  @ApiPropertyOptional()
  emailTradeUpdates?: boolean;
}
