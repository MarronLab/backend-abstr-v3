import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { BaseService } from '../../../common/base.service';
import { PrismaService } from '../../../services/prisma.service';
import { MarketDataQueryParams } from '../dto/marketQueryParam.dto';

@Injectable({ scope: Scope.REQUEST })
export class MarketService extends BaseService {
  private readonly endpoint = 'coins/markets';
  private readonly coinEndpoint = 'coins';
  private readonly cacheTTL = 3600;


  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) req: Request,
  ) {
    super(prismaService, req);
  }

  async getMarketData(queryParams: MarketDataQueryParams) {
    try {
      const lastUpdated = await this.getClient().marketData.findFirst({
        orderBy: {
          last_updated: 'desc',
        },
      });

      if (lastUpdated) {
        const now = new Date();
        const lastUpdatedDate = new Date(lastUpdated.last_updated);
        const timeDiff = now.getTime() - lastUpdatedDate.getTime();
        const diffHours = timeDiff / (1000 * 3600);

        if (diffHours < 1) {
          const cachedData = await this.getClient().marketData.findMany();
          return this.transformMarketData(cachedData);
        }
      }

      const params: any = {
        vs_currency: queryParams.vs_currency || 'usd',
        ids: queryParams.ids,
        category: queryParams.category,
        order: queryParams.order || 'market_cap_desc',
        per_page: queryParams.per_page || 100,
        page: queryParams.page || 1,
        sparkline: queryParams.sparkline || false,
        price_change_percentage: queryParams.price_change_percentage,
        locale: queryParams.locale || 'en',
        precision: queryParams.precision,
      };

      const response = await firstValueFrom(
        this.httpService.get(this.endpoint, { params }),
      );

      const transformResponse = (data: any[]) => {
        return data.map((coin) => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image,
          current_price: this.toNumberOrNull(coin.current_price),
          market_cap: this.toNumberOrNull(coin.market_cap),
          market_cap_rank: coin.market_cap_rank,
          fully_diluted_valuation: this.toNumberOrNull(
            coin.fully_diluted_valuation,
          ),
          total_volume: this.toNumberOrNull(coin.total_volume),
          high_24h: this.toNumberOrNull(coin.high_24h),
          low_24h: this.toNumberOrNull(coin.low_24h),
          price_change_24h: this.toNumberOrNull(coin.price_change_24h),
          price_change_percentage_24h: this.toNumberOrNull(
            coin.price_change_percentage_24h,
          ),
          market_cap_change_24h: this.toNumberOrNull(
            coin.market_cap_change_24h,
          ),
          market_cap_change_percentage_24h: this.toNumberOrNull(
            coin.market_cap_change_percentage_24h,
          ),
          circulating_supply: this.toNumberOrNull(coin.circulating_supply),
          total_supply: this.toNumberOrNull(coin.total_supply),
          max_supply: this.toNumberOrNull(coin.max_supply),
          ath: this.toNumberOrNull(coin.ath),
          ath_change_percentage: this.toNumberOrNull(
            coin.ath_change_percentage,
          ),
          ath_date: coin.ath_date,
          atl: this.toNumberOrNull(coin.atl),
          atl_change_percentage: this.toNumberOrNull(
            coin.atl_change_percentage,
          ),
          atl_date: coin.atl_date,
          last_updated: coin.last_updated,
          sparkline_in_7d: coin.sparkline_in_7d?.price || [],
        }));
      };

      const marketData = transformResponse(response.data);

      await this.saveMarketData(marketData);

      return marketData;
    } catch (error) {
      this.handleError(error);
    }
  }

  private transformMarketData(data: any[]) {
    return data.map((coin) => ({
      ...coin,
      ath_date: this.formatDate(coin.ath_date),
      atl_date: this.formatDate(coin.atl_date),
      last_updated: new Date(coin.last_updated).toISOString(),
    }));
  }

  private formatDate(date: string): string {
    return new Date(date).toISOString();
  }

  private async saveMarketData(data: any[]) {
    try {
      const now = new Date();

      await Promise.all(
        data.map(async (coin) => {
          await this.getClient().marketData.upsert({
            where: { id: coin.id },
            update: { ...coin, last_updated: now },
            create: { ...coin, last_updated: now },
          });
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  // async getCoinById(id: string) {
  //   const endpoint = `${this.coinEndpoint}/${id}`;
  //   try {
  //     const response = await firstValueFrom(this.httpService.get(endpoint));
  //     console.log('logging response', response);
  //     return response.data;
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  async getCoinById(id: string) {
    const cachedData = await this.getCachedCoinData(id);

    if (cachedData) {
      console.log('Retrieving coin data from cache');
      return cachedData;
    }

    console.log('Fetching coin data from CoinGecko');
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.coinEndpoint}/${id}`),
      );
      const coinData = response.data;

      // Save fetched data to cache (database)
      await this.saveCoinDataToCache(id, coinData);

      return coinData;
    } catch (error) {
      this.handleError(error);
    }
  }

  private async getCachedCoinData(id: string): Promise<any | null> {
    const cachedCoin = await this.getClient().marketData.findUnique({
      where: { id },
    });

    if (cachedCoin) {
      const now = new Date();
      const lastUpdated = new Date(cachedCoin.last_updated);
      const diffSeconds = (now.getTime() - lastUpdated.getTime()) / 1000;

      // Check if cached data is within TTL
      if (diffSeconds < this.cacheTTL) {
        return cachedCoin;
      }
    }

    return null;
  }

  private async saveCoinDataToCache(id: string, data: any): Promise<void> {
    try {
      const now = new Date();

      await this.getClient().marketData.upsert({
        where: { id },
        update: { ...data, last_updated: now },
        create: { ...data, last_updated: now },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to save coin data to cache',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private toNumberOrNull(value: any): number | null {
    return value === null || value === undefined ? null : Number(value);
  }

  private handleError(error: any): void {
    throw new HttpException(
      error.response?.data?.message || error.message,
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
