import { ApiPropertyOptional } from '@nestjs/swagger';

export class OrderHistoryDto {
  @ApiPropertyOptional()
  count?: number;

  @ApiPropertyOptional()
  page?: number;
}
