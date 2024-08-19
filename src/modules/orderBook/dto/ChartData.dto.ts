import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetChartDataQueryDto {
  @ApiProperty({
    description: 'Base currency. e.g. BTC',
  })
  @IsString()
  baseCurrency: string;

  @ApiProperty({
    description: 'Quote currency. e.g. ETH',
  })
  @IsString()
  quoteCurrency: string;

  @ApiProperty({
    description: 'Time in seconds before which data to be fetched.',
  })
  @IsNumber()
  @Type(() => Number)
  timestamp: number;

  @ApiProperty({
    description: 'Interval in minutes. Default is 1440',
    required: false,
    default: 1440,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  interval?: number;

  @ApiProperty({
    description: 'Default is 250',
    required: false,
    default: 250,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}

export class ChartDataResponseDto {
  @ApiProperty()
  time: number;

  @ApiProperty()
  open: number;

  @ApiProperty()
  close: number;

  @ApiProperty()
  high: number;

  @ApiProperty()
  low: number;

  @ApiProperty()
  volume: number;

  constructor(partial: Partial<ChartDataResponseDto>) {
    Object.assign(this, partial);
  }
}
