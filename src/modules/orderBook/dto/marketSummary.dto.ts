// market-summary.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class MarketSummaryPairDataDto {
  @ApiProperty({ type: Number, description: 'Last trade price' })
  Last: number;

  @ApiProperty({ type: Number, description: 'Lowest ask price' })
  LowestAsk: number;

  @ApiProperty({ type: Number, description: 'Highest bid price' })
  HeighestBid: number;

  @ApiProperty({ type: Number, description: 'Percentage change' })
  PercentChange: number;

  @ApiProperty({ type: Number, description: 'Base volume' })
  BaseVolume: number;

  @ApiProperty({ type: Number, description: 'Quote volume' })
  QuoteVolume: number;

  @ApiProperty({ type: Number, description: 'Highest price in 24 hours' })
  High_24hr: number;

  @ApiProperty({ type: Number, description: 'Lowest price in 24 hours' })
  Low_24hr: number;

  constructor(partial: Partial<MarketSummaryPairDataDto>) {
    Object.assign(this, partial);
  }
}

export class MarketSummaryDataDto {
  @ApiProperty({
    type: MarketSummaryPairDataDto,
    description: 'Market summary pair data',
  })
  pair: MarketSummaryPairDataDto;

  constructor(partial: Partial<MarketSummaryDataDto>) {
    Object.assign(this, partial);
  }
}

export class MarketSummaryResponseDto {
  @ApiProperty({ enum: ['Success'], description: 'Response status' })
  status: 'Success';

  @ApiProperty({ type: String, description: 'Response message' })
  message: string;

  @ApiProperty({
    type: MarketSummaryDataDto,
    description: 'Market summary data',
  })
  data: MarketSummaryDataDto;

  constructor(partial: Partial<MarketSummaryResponseDto>) {
    Object.assign(this, partial);
  }
}
