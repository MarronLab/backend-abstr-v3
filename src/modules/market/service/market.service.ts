import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { BaseService } from '../../../common/base.service';
import { PrismaService } from '../../../services/prisma.service';
import { CoingeckoService } from '../../../services/coingecko/coingecko.service';
import { CoinGeckoMarketDataResponse } from '../../../services/coingecko/coingecko.type';
import { MarketDataResponseDto } from '../dto/market.dto';

@Injectable({ scope: Scope.REQUEST })
export class MarketService extends BaseService {
  private readonly params = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 10,
    page: 1,
    sparkline: true,
  };

  constructor(
    private readonly coingeckoService: CoingeckoService,
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
          const parsedData = lastUpdated.data.map((item: string) =>
            JSON.parse(item),
          ) as CoinGeckoMarketDataResponse[];
          return this.transformResponse(parsedData);
        }
      }

      const response = await this.coingeckoService.getMarketData(this.params);
      const marketData = this.transformResponse(response);

      await this.saveMarketData(marketData);

      return marketData;
    } catch (error) {
      this.handleError(error);
    }
  }

  private transformResponse(
    data: CoinGeckoMarketDataResponse[],
  ): MarketDataResponseDto[] {
    return data.map(
      (coin) =>
        new MarketDataResponseDto({
          id: coin.id || '',
          symbol: coin.symbol || '',
          name: coin.name || '',
          image: coin.image || '',
          current_price:
            coin.current_price !== null && coin.current_price !== undefined
              ? coin.current_price
              : 0,
          market_cap: this.toNumberOrNull(coin.market_cap),
          market_cap_rank:
            coin.market_cap_rank !== null && coin.market_cap_rank !== undefined
              ? coin.market_cap_rank
              : 0,
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
          ath_date: coin.ath_date || '',
          atl: this.toNumberOrNull(coin.atl),
          atl_change_percentage: this.toNumberOrNull(
            coin.atl_change_percentage,
          ),
          atl_date: coin.atl_date || '',
          last_updated: coin.last_updated || '',
          sparkline_in_7d: coin.sparkline_in_7d || [],
        }),
    );
  }

  private async saveMarketData(data: MarketDataResponseDto[]) {
    try {
      const now = new Date();
      const jsonData = data.map((item) => JSON.stringify(item));
      await this.getClient().coinGeckoResponse.upsert({
        where: { type: 'MARKET_DATA' },
        update: { data: jsonData, updatedAt: now },
        create: {
          type: 'MARKET_DATA',
          data: jsonData,
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

  async trendingMarket() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.trending),
      );

      const transformTrendingResponse = (data: any[]) => {
        return data.map((coin) => {
          return new TrendingMarketDataResponseDto({
            id: coin.item.id,
            coin_id: coin.item.coin_id,
            name: coin.item.name,
            symbol: coin.item.symbol,
            market_cap_rank: coin.item.market_cap_rank,
            thumb: coin.item.thumb,
            small: coin.item.small,
            large: coin.item.large,
            price_btc: coin.item.price_btc,
            score: coin.item.score,
            data: {
              price: coin.item.data.price,
              price_btc: coin.item.data.price_btc,
              price_change_percentage_24h: {
                btc: coin.item.data.price_change_percentage_24h?.btc || 0,
                usd: coin.item.data.price_change_percentage_24h?.usd || 0,
              },
              market_cap: coin.item.data.market_cap || '',
              market_cap_btc: coin.item.data.market_cap_btc || '',
              total_volume: coin.item.data.total_volume || '',
              total_volume_btc: coin.item.data.total_volume_btc || '',
              sparkline: coin.item.data.sparkline || '',
            },
          });
        });
      };
      return transformTrendingResponse(response.data.coins);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): void {
    throw new HttpException(
      error.response?.data?.message || error.message,
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
