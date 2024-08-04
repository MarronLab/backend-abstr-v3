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
    description: 'The order side accept SELL, BUY, or ALL',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['BUY', 'SELL', 'ALL'], {
    message: 'Side must be one of the following values: BUY, SELL, or ALL',
  })
  side: 'SELL' | 'BUY' | 'ALL';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  depth?: number = 10;
}
