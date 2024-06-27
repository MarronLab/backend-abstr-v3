export class WalletNetworthResponseDto {
  totalFiatAmount: number;
  totalCryptoAmount: number;
  totalNetworth: number;
  cryptoPercentage: number;
  fiatPercentage: number;

  constructor(partial: Partial<WalletNetworthResponseDto>) {
    Object.assign(this, partial);
  }
}
