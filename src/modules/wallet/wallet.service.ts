import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';

@Injectable()
export class WalletService {
  constructor(private readonly modulusService: ModulusService) {}

  async getBalances() {
    try {
      const { data: balanceData } = await this.modulusService.getBalance();
      const { data: coinStatsData } = await this.modulusService.getCoinStats();

      if (balanceData.status === 'Error') {
        throw new UnprocessableEntityException(balanceData.data);
      }

      return balanceData.data.map((balance) => {
        const stats = coinStatsData.data[balance.currency.toLowerCase()];

        return {
          balance: balance.balance,
          currency: balance.currency,
          holdDeposits: balance.holdDeposits,
          balanceInTrade: balance.balanceInTrade,
          priceChangePercent24hr: stats?.priceChangePercent24hr || null,
        };
      });
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
