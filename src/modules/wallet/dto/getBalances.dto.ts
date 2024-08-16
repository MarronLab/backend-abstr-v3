import { ApiProperty } from '@nestjs/swagger';

export class GetBalancesResponseDto {
  @ApiProperty()
  currency: string;

  @ApiProperty()
  fiatValue: number;

  @ApiProperty({ type: String, nullable: true })
  currencyName: null | string;

  @ApiProperty({ type: String, nullable: true })
  thumbnail: null | string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  balanceInTrade: number;

  @ApiProperty()
  holdDeposits: number;

  @ApiProperty()
  decimalPrecision: number;

  @ApiProperty()
  contractAddress: string;

  @ApiProperty({ type: String, nullable: true })
  priceChangePercent24hr: null | string;

  constructor(partial: Partial<GetBalancesResponseDto>) {
    Object.assign(this, partial);
  }
}
