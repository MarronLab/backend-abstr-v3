import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import HelperProvider from 'src/utils/helperProvider';
import {
  MoralisTransactionData,
  MoralisTransactions,
  NetworthResponse,
} from './moralis.type';

@Injectable()
export class MoralisService {
  constructor(private readonly httpService: HttpService) {}

  async networth(walletAddress: string) {
    try {
      const response = await this.httpService.axiosRef.get<NetworthResponse>(
        `/v2.2/wallets/${walletAddress}/net-worth?chains=${HelperProvider.getNetworkName()}&exclude_spam=true&exclude_unverified_contracts=true`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async transactions(options: {
    chain: string;
    address: string;
    cursor?: string;
    limit?: number;
  }) {
    try {
      const response = await this.httpService.axiosRef.get<MoralisTransactions>(
        `/v2.2/${options.address}?chain=${options.chain}&order=DESC&cursor=${options.cursor}&limit=${options.limit}`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAllMoralisWalletTransactions(walletAddress: string) {
    let allTransactions: MoralisTransactionData[] = [];
    let cursor = undefined;

    do {
      const options = {
        chain: HelperProvider.getNetworkName(),
        address: walletAddress,
        cursor: cursor,
        limit: 100,
      };

      const response = await this.transactions(options);
      allTransactions = allTransactions.concat(response.result);
      cursor = response.cursor;
    } while (cursor);

    return allTransactions;
  }
}
