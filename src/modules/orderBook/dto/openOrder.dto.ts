import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AssetOpenOrderRequestDto {
  @ApiProperty({
    description: 'The currency pair for the market',
  })
  @IsString()
  @IsNotEmpty()
  pair: string;

  @ApiProperty({
    description: 'The order side accept SELL or BUY',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['BUY', 'SELL'])
  side: 'SELL' | 'BUY';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  depth?: number = 10;
}
