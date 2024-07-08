import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  CoinGeckoMarketDataResponse,
  CoingeckoTrendingDataResponse,
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
      throw new HttpException(
        {
          message: error.response?.data?.Message,
          details: error.message,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async get<T>(endpoint: string, params: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(endpoint, { params }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        {
          message: error.response?.data?.Message,
          details: error.message,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
}
