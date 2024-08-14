import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { TransactionData } from 'src/services/modulus/modulus.type';
import { WalletPerformanceDurationEnum } from './wallet.enum';
import { WalletPerformanceDto } from './dto/performance.dto';
import axios from 'axios';
import HelperProvider from 'src/utils/helperProvider';
import ConstantProvider from 'src/utils/constantProvider';
import { MoralisTokenInfo } from './wallet.interface';
import { MoralisService } from 'src/services/moralis/moralis.service';
import { MoralisTransactionData } from 'src/services/moralis/moralis.type';

@Injectable()
export class WalletService {
  constructor(
    private readonly modulusService: ModulusService,
    private readonly moralisService: MoralisService,
  ) {}

  async getSafeAddressBalances(safeAddress: string) {
    try {
      const url = `https://deep-index.moralis.io/api/v2.2/${safeAddress}/erc20?chain=${HelperProvider.getNetworkName()}`;
      const headers = {
        accept: 'application/json',
        'X-API-Key': ConstantProvider.MORALIS_API_KEY,
      };
      const tokenBalanceResponse = await axios.get<MoralisTokenInfo[]>(url, {
        headers,
      });

      const { data: balanceData } = await this.modulusService.getBalance();
      const { data: coinStatsData } = await this.modulusService.getCoinStats();

      if (balanceData.status === 'Error') {
        throw new UnprocessableEntityException(balanceData.data);
      }

      return balanceData.data.map((balance) => {
        const stats = coinStatsData.data[balance.currency.toLowerCase()];
        const tokenBalance = tokenBalanceResponse.data.find(
          (x) => x.symbol === balance.currency,
        );

        const currentBalance = tokenBalance ? Number(tokenBalance.balance) : 0;

        return {
          balance: currentBalance,
          fiatValue: Number(stats?.price) || 0,
          currencyName: stats?.coinName || null,
          currency: balance.currency,
          thumbnail: stats?.image || null,
          holdDeposits: balance.holdDeposits,
          balanceInTrade: balance.balanceInTrade,
          priceChangePercent24hr: stats?.priceChangePercent24hr || null,
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

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
      throw new InternalServerErrorException(error);
    }
  }

  private async getResolvedPaginatedTransactions() {
    let transactions: TransactionData[] = [];
    let currentPage = 1;
    let totalRows = 0;

    try {
      do {
        const { data } = await this.modulusService.getAllTransactions({
          page: currentPage,
          count: 100,
        });
        const {
          rows,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          pageInfo: { totalRows: newTotalRows, pageSize },
        } = data.data;

        transactions = [...transactions, ...rows];

        totalRows = newTotalRows;

        currentPage++;
      } while (transactions.length < totalRows);

      return transactions;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private calculatePerformanceData(
    transactions: TransactionData[],
    startDate: string,
  ) {
    let initialBalance = 0,
      finalBalance = 0;

    const filteredTransactions = transactions.filter(
      (transaction) => new Date(transaction.requestDate) >= new Date(startDate),
    );

    const data = filteredTransactions.map((transaction) => {
      if (
        transaction.status === 'Processed' ||
        transaction.status === 'Approved'
      ) {
        if (transaction.type.toLowerCase().includes('withdrawal')) {
          finalBalance -= transaction.equivalentUsdAmt;
        } else if (transaction.type.toLowerCase().includes('deposit')) {
          finalBalance += transaction.equivalentUsdAmt;
        }
      }

      return {
        timestamp: transaction.requestDate,
        balance: transaction.equivalentUsdAmt,
      };
    });

    if (data.length) initialBalance = data[0].balance;
    const balanceChange = finalBalance - initialBalance;
    const balanceChangePercentage = initialBalance
      ? ((balanceChange / initialBalance) * 100).toFixed(2)
      : 'N/A';

    return {
      data,
      finalBalance,
      balanceChange,
      balanceChangePercentage,
    };
  }

  private getStartDate = (duration: WalletPerformanceDurationEnum) => {
    const now = new Date();
    switch (duration) {
      case WalletPerformanceDurationEnum.HOURLY:
        return new Date(now.getTime() - 60 * 60 * 1000);
      case WalletPerformanceDurationEnum.DAILY:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case WalletPerformanceDurationEnum.WEEKLY:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case WalletPerformanceDurationEnum.MONTHLY:
        return new Date(now.setMonth(now.getMonth() - 1));
      case WalletPerformanceDurationEnum.THREE_MONTHLY:
        return new Date(now.setMonth(now.getMonth() - 3));
      case WalletPerformanceDurationEnum.YEARLY:
        return new Date(now.setFullYear(now.getFullYear() - 1));
      case WalletPerformanceDurationEnum.ALL:
        return new Date(0);
      default:
        throw new Error('Invalid duration');
    }
  };

  async getWalletPerformance(walletPerformanceDto: WalletPerformanceDto) {
    try {
      const startDate = this.getStartDate(
        walletPerformanceDto.duration,
      ).toISOString();
      const transactions = await this.getResolvedPaginatedTransactions();
      const { balanceChangePercentage, balanceChange, data, finalBalance } =
        this.calculatePerformanceData(transactions, startDate);

      return {
        graph: data,
        finalBalance,
        balanceChange,
        balanceChangePercentage,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private calculateNetworth(transactions: TransactionData[]) {
    let totalFiatAmount = 0,
      totalCryptoAmount = 0;

    transactions.forEach((transaction) => {
      if (
        transaction.status === 'Pending' ||
        transaction.status === 'Rejected'
      ) {
        return;
      }

      if (transaction.type.startsWith('Fiat')) {
        if (transaction.type.toLowerCase().includes('deposit')) {
          totalFiatAmount += transaction.equivalentUsdAmt;
        } else if (transaction.type.toLowerCase().includes('withdrawal')) {
          totalFiatAmount -= transaction.equivalentUsdAmt;
        }
      }

      if (transaction.type.startsWith('Crypto')) {
        if (transaction.type.toLowerCase().includes('deposit')) {
          totalCryptoAmount += transaction.equivalentUsdAmt;
        } else if (transaction.type.toLowerCase().includes('withdrawal')) {
          totalCryptoAmount -= transaction.equivalentUsdAmt;
        }
      }
    });

    const totalNetworth = totalFiatAmount + totalCryptoAmount;
    const cryptoPercentage = (totalCryptoAmount / totalNetworth) * 100;
    const fiatPercentage = (totalFiatAmount / totalNetworth) * 100;

    return {
      totalFiatAmount,
      totalCryptoAmount,
      totalNetworth,
      cryptoPercentage,
      fiatPercentage,
    };
  }

  async getWalletNetWorth() {
    try {
      const transactions = await this.getResolvedPaginatedTransactions();
      const {
        fiatPercentage,
        cryptoPercentage,
        totalNetworth,
        totalCryptoAmount,
        totalFiatAmount,
      } = this.calculateNetworth(transactions);

      return {
        fiatPercentage,
        cryptoPercentage,
        totalNetworth,
        totalFiatAmount,
        totalCryptoAmount,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getMoralisWalletNetWorth(walletAddress: string) {
    try {
      const response = await this.moralisService.networth(walletAddress);

      const totalNetworth = Number(response.total_networth_usd);
      const cryptoPercentage = totalNetworth
        ? (totalNetworth / totalNetworth) * 100
        : 0;
      const fiatPercentage = totalNetworth ? (0 / totalNetworth) * 100 : 0;

      return {
        fiatPercentage: fiatPercentage ?? 0,
        cryptoPercentage: cryptoPercentage ?? 0,
        totalNetworth,
        totalFiatAmount: 0,
        totalCryptoAmount: totalNetworth,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private calculateMoralisPerformanceData(
    transactions: MoralisTransactionData[],
    startDate: string,
    walletAddress: string,
  ) {
    let initialBalance = 0,
      finalBalance = 0;

    const filteredTransactions = transactions.filter(
      (transaction) =>
        new Date(transaction.block_timestamp) >= new Date(startDate),
    );

    const data = filteredTransactions.map((transaction) => {
      if (transaction.receipt_status === '1') {
        const isDeposit =
          transaction.to_address.toLowerCase() === walletAddress.toLowerCase();
        finalBalance += isDeposit
          ? Number(transaction.value)
          : -Number(transaction.value);
      }

      return {
        timestamp: Date.parse(transaction.block_timestamp) / 1000,
        balance: Number(transaction.value),
      };
    });

    if (data.length) initialBalance = data[0].balance;
    const balanceChange = finalBalance - initialBalance;
    const balanceChangePercentage = initialBalance
      ? ((balanceChange / initialBalance) * 100).toFixed(2)
      : 'N/A';

    return {
      data,
      finalBalance,
      balanceChange,
      balanceChangePercentage,
    };
  }

  async getMoralisWalletPerformace(
    walletAddress: string,
    walletPerformanceDto: WalletPerformanceDto,
  ) {
    const startDate = this.getStartDate(
      walletPerformanceDto.duration,
    ).toISOString();

    try {
      const transactions =
        await this.moralisService.getAllMoralisWalletTransactions(
          walletAddress,
        );

      const { data, finalBalance, balanceChange, balanceChangePercentage } =
        this.calculateMoralisPerformanceData(
          transactions,
          startDate,
          walletAddress,
        );

      return {
        graph: data,
        finalBalance,
        balanceChange,
        balanceChangePercentage,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
