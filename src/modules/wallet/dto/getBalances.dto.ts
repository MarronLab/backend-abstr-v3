export class GetBalancesResponseDto {
  currency: string;
  balance: number;
  balanceInTrade: number;
  holdDeposits: number;
  priceChangePercent24hr: null | string;

  constructor(partial: Partial<GetBalancesResponseDto>) {
    Object.assign(this, partial);
  }
}
