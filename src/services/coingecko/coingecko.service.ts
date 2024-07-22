import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  CoinGeckoMarketDataResponse,
  CoingeckoTrendingDataResponse,
  CoinGeckoTopGainerLoserResponse,
  SingleCoinGeckoDataResponse,
} from './coingecko.type';

@Injectable()
export class CoingeckoService {
  constructor(private readonly httpService: HttpService) {}

  private async post<T>(endpoint: string, request?: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post<T>(endpoint, request),
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async get<T>(endpoint: string, params: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(endpoint, { params }),
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMarketData(params: any) {
    return await this.get<CoinGeckoMarketDataResponse[]>(
      '/coins/markets',
      params,
    );
  }

  async getTrendingMarketData() {
    return await this.get<CoingeckoTrendingDataResponse>('search/trending', {});
  }

  async getTopGainerLoserData(params: any) {
    return await this.get<CoinGeckoTopGainerLoserResponse>(
      '/coins/top_gainers_losers',
      params,
    );
  }

  async getSingleCoinData(id: string, params: any) {
    return await this.get<SingleCoinGeckoDataResponse>(`/coins/${id}`, params);
  }
}
