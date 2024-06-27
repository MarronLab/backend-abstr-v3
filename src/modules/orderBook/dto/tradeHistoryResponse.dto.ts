export class TradeHistoryResponseDto {
  id: number;
  volume: number;
  rate: number;
  trade: string;
  market: string;
  amount: number;
  serviceCharge: number;
  date: string;
  side: 'BUY' | 'SELL';

  constructor(partial: Partial<TradeHistoryResponseDto>) {
    Object.assign(this, partial);
  }
}
