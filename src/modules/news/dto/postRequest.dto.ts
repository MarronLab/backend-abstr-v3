import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class PostQueryDto {
  @ApiPropertyOptional({ description: 'Next page URL for pagination' })
  @IsOptional()
  @IsString()
  next?: string;

  @ApiPropertyOptional({ description: 'Previous page URL for pagination' })
  @IsOptional()
  @IsString()
  previous?: string;

  @ApiPropertyOptional({ description: 'Limit the number of results' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
