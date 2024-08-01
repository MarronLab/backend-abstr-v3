import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import HelperProvider from 'src/utils/helperProvider';
import { MoralisTransactions, NetworthResponse } from './moralis.type';

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

  async transactions(walletAddress: string) {
    try {
      const response = await this.httpService.axiosRef.get<MoralisTransactions>(
        `/v2.2/wallets/${walletAddress}/net-worth?chains=${HelperProvider.getNetworkName()}&exclude_spam=true&exclude_unverified_contracts=true`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
