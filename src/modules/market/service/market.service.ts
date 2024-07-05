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

@Injectable({ scope: Scope.REQUEST })
export class MarketService extends BaseService {
  private readonly endpoint = 'coins/markets';
  private readonly params = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 10,
    page: 1,
    sparkline: true,
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) req: Request,
  ) {
    super(prismaService, req);
  }

  async getMarketData() {
    try {
      const lastUpdated = await this.getClient().coinGeckoResponse.findFirst({
        where: { type: 'MARKET_DATA' },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      if (lastUpdated) {
        const now = new Date();
        const lastUpdatedDate = new Date(lastUpdated.updatedAt);
        const timeDiff = now.getTime() - lastUpdatedDate.getTime();
        const diffHours = timeDiff / (1000 * 3600);

        if (diffHours < 1) {
          return lastUpdated.data;
        }
      }

      const response = await firstValueFrom(
        this.httpService.get(this.endpoint, { params: this.params }),
      );

      const marketData = this.transformResponse(response.data);

      await this.saveMarketData(marketData);

      return marketData;
    } catch (error) {
      this.handleError(error);
    }
  }

  private transformResponse(data: any[]) {
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
      market_cap_change_24h: this.toNumberOrNull(coin.market_cap_change_24h),
      market_cap_change_percentage_24h: this.toNumberOrNull(
        coin.market_cap_change_percentage_24h,
      ),
      circulating_supply: this.toNumberOrNull(coin.circulating_supply),
      total_supply: this.toNumberOrNull(coin.total_supply),
      max_supply: this.toNumberOrNull(coin.max_supply),
      ath: this.toNumberOrNull(coin.ath),
      ath_change_percentage: this.toNumberOrNull(coin.ath_change_percentage),
      ath_date: coin.ath_date,
      atl: this.toNumberOrNull(coin.atl),
      atl_change_percentage: this.toNumberOrNull(coin.atl_change_percentage),
      atl_date: coin.atl_date,
      last_updated: coin.last_updated,
      sparkline_in_7d: coin.sparkline_in_7d?.price || [],
    }));
  }

  private async saveMarketData(data: any[]) {
    try {
      const now = new Date();
      await this.getClient().coinGeckoResponse.upsert({
        where: { type: 'MARKET_DATA' },
        update: { data, updatedAt: now },
        create: {
          type: 'MARKET_DATA',
          data,
          createdAt: now,
          updatedAt: now,
        },
      });
    } catch (error) {
      throw error;
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
