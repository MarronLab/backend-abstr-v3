import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import HelperProvider from 'src/utils/helperProvider';
import {
  MoralisTransaction,
  MoralisTransactionsResponse,
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

  async transactions({
    chain,
    address,
    limit = 20,
    cursor = '',
  }: {
    chain: string;
    address: string;
    cursor?: string;
    limit?: number;
  }) {
    try {
      const response =
        await this.httpService.axiosRef.get<MoralisTransactionsResponse>(
          `/v2.2/wallets/${address}/history?chain=${chain}&order=DESC&cursor=${cursor}&limit=${limit}`,
        );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  flattenMoralisTransaction(transactions: MoralisTransaction[]) {
    return transactions.flatMap((transaction) => {
      const { hash, block_timestamp, receipt_status } = transaction;

      // Flatten ERC20 transfers
      const erc20Transfers = transaction.erc20_transfers.map((erc20) => ({
        hash,
        block_timestamp,
        receipt_status,
        token_symbol: erc20.token_symbol,
        value: parseFloat(erc20.value_formatted),
        direction: erc20.direction,
        type: 'erc20',
      }));

      // Flatten native transfers
      const nativeTransfers = transaction.native_transfers.map((native) => ({
        hash,
        block_timestamp,
        receipt_status,
        token_symbol: native.token_symbol,
        value: parseFloat(native.value_formatted),
        direction: native.direction,
        type: 'native',
      }));

      // Combine both transfers into one array
      return [...erc20Transfers, ...nativeTransfers];
    });
  }

  async getAllMoralisWalletTransactions(walletAddress: string) {
    let allTransactions: MoralisTransaction[] = [];
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
