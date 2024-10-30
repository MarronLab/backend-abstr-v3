import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  AddressBalanceResponse,
  ExchangeRatesResponse,
  TokenType
} from './quicknode.type';

@Injectable()
export class QuicknodeService {
  constructor(private readonly httpService: HttpService) {}

  async getAddressTokenBalances(address: string, page: number, size: number) {
    try {
      const response = await this.httpService.axiosRef.post<AddressBalanceResponse>(
        ``,
        {
          method: "bb_getAddress",
          params: [
            address,
            {
              page: page,
              size: size,
              fromHeight: 0,
              details: "txids",
              secondary: "usd"
            }
          ]
        }
      );

      const erc20Tokens = response.data.result.tokens.filter((token) => token.type === TokenType.ERC20)

      return erc20Tokens;
    } catch (error) {
      throw error;
    }
  }

  async getExchangeRate(baseCurrency = "USD", rates = ["EUR", "GBP", "JPY", "AUD", "CAD"]) {
    try {
      const response = await this.httpService.axiosRef.post<ExchangeRatesResponse>(
        ``,
        {
          jsonrpc: "2.0",
          id: 1,
          method: "forex_getExchangeRate",
          params: [baseCurrency, rates],
        },
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
