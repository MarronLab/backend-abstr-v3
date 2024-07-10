import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';

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

  @ApiProperty({
    description: 'The depth of the order book to retrieve',
  })
  @IsNumber()
  depth: number;
}
