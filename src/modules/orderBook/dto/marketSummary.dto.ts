import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

class MarketSummaryDataDto {
  @ApiProperty()
  @IsNumber()
  Last: number;

  @ApiProperty()
  @IsNumber()
  LowestAsk: number;

  @ApiProperty()
  @IsNumber()
  HeighestBid: number;

  @ApiProperty()
  @IsNumber()
  PercentChange: number;

  @ApiProperty()
  @IsNumber()
  BaseVolume: number;

  @ApiProperty()
  @IsNumber()
  QuoteVolume: number;

  @ApiProperty()
  @IsNumber()
  High_24hr: number;

  @ApiProperty()
  @IsNumber()
  Low_24hr: number;
}

export class MarketSummaryDtoResponse {
  [key: string]: MarketSummaryDataDto;
}
