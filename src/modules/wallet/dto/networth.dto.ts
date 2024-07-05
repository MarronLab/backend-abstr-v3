import { ApiProperty } from '@nestjs/swagger';

export class WalletNetworthResponseDto {
  @ApiProperty()
  totalFiatAmount: number;

  @ApiProperty()
  totalCryptoAmount: number;

  @ApiProperty()
  totalNetworth: number;

  @ApiProperty()
  cryptoPercentage: number;

  @ApiProperty()
  fiatPercentage: number;

  constructor(partial: Partial<WalletNetworthResponseDto>) {
    Object.assign(this, partial);
  }
}
