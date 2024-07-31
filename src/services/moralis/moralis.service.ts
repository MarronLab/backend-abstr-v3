import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import HelperProvider from 'src/utils/helperProvider';

@Injectable()
export class MoralisService {
  constructor(private readonly httpService: HttpService) {}

  async networth(walletAddress: string) {
    this.httpService.axiosRef.get(
      `/v2.2/wallets/${walletAddress}/net-worth?chains=${HelperProvider.getNetworkName()}&chains%5B1%5D=polygon&exclude_spam=true&exclude_unverified_contracts=true`,
    );
  }
}
