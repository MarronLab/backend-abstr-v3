import { ApiProperty } from '@nestjs/swagger';

export class GetBalancesResponseDto {
  @ApiProperty()
  currency: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  balanceInTrade: number;

  @ApiProperty()
  holdDeposits: number;

  @ApiProperty({ type: String, nullable: true })
  priceChangePercent24hr: null | string;

  constructor(partial: Partial<GetBalancesResponseDto>) {
    Object.assign(this, partial);
  }
}
