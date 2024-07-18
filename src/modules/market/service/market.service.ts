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
import { ModulusService } from 'src/services/modulus/modulus.service';
import {
  CoinGeckoMarketDataResponse,
  CoingeckoTrendingItem,
  CoinGeckoTopGainerLoserResponse,
} from '../../../services/coingecko/coingecko.type';
import {
  MarketDataResponseDto,
  TrendingMarketDataResponseDto,
  TopGainerLoserResponseDto,
  TopGainerLoserDataResponseDto,
  GetMarketDataQueryDto,
} from '../dto/market.dto';

import { paginate } from 'src/utils/pagination';

@Injectable({ scope: Scope.REQUEST })
export class MarketService extends BaseService {
  private readonly params = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 250,
    page: 1,
    sparkline: true,
  };

  private readonly topGainerLoserParams = {
    vs_currency: 'usd',
    duration: '24h',
    top_coins: '1000',
  };

  private readonly singleCoinDataparams = {
    localization: false,
    community_data: false,
    developer_data: false,
    sparkline: true,
  };

  constructor(
    private readonly coingeckoService: CoingeckoService,
    private readonly modulusService: ModulusService,
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) req: Request,
  ) {
    super(prismaService, req);
  }

  async getMarketData(queryParams: GetMarketDataQueryDto) {
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
          const marketData = this.transformResponse(parsedData);
          return paginate(
            marketData,
            queryParams.page ?? 1,
            queryParams.per_page ?? 10,
          );
        }
      }

      const response = await this.coingeckoService.getMarketData(this.params);
      const marketData = this.transformResponse(response);

      await this.saveMarketData(marketData);
      return paginate(
        marketData,
        queryParams.page ?? 1,
        queryParams.per_page ?? 10,
      );
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
          sparkline_in_7d: {
            price: Array.isArray(coin.sparkline_in_7d.price)
              ? coin.sparkline_in_7d.price
              : [],
          },
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
  async trendingMarket(params: { page: number; per_page: number }) {
    try {
      const lastUpdated = await this.getClient().coinGeckoResponse.findFirst({
        where: { type: 'TRENDING_DATA' },
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
          const parsedData = lastUpdated.data.map((item: string) => {
            const parsedItem = JSON.parse(item);
            return parsedItem;
          }) as CoingeckoTrendingItem[];
          const trendingData = this.transformTrendingResponse(parsedData);
          return paginate(trendingData, params.page, params.per_page);
        }
      }

      const response = await this.coingeckoService.getTrendingMarketData();
      const trendingData = this.transformTrendingResponse(response.coins);

      await this.saveTrendingMarketData(trendingData);
      return paginate(trendingData, params.page, params.per_page);
    } catch (error) {
      this.handleError(error);
    }
  }

  private transformTrendingResponse(
    data: CoingeckoTrendingItem[],
  ): TrendingMarketDataResponseDto[] {
    return data.map((coin) => {
      const item = coin.item || coin;
      return new TrendingMarketDataResponseDto({
        id: item.id,
        coin_id: item.coin_id,
        name: item.name,
        symbol: item.symbol,
        market_cap_rank: item.market_cap_rank,
        thumb: item.thumb,
        small: item.small,
        large: item.large,
        price_btc: item.price_btc,
        score: item.score,
        data: {
          price: item.data.price,
          price_btc: item.data.price_btc,
          price_change_percentage_24h: {
            btc: item.data.price_change_percentage_24h?.btc || 0,
            usd: item.data.price_change_percentage_24h?.usd || 0,
          },
          market_cap: item.data.market_cap || '',
          market_cap_btc: item.data.market_cap_btc || '',
          total_volume: item.data.total_volume || '',
          total_volume_btc: item.data.total_volume_btc || '',
          sparkline: item.data.sparkline || '',
        },
      });
    });
  }

  private async saveTrendingMarketData(data: TrendingMarketDataResponseDto[]) {
    try {
      const now = new Date();
      const jsonData = data.map((item) => JSON.stringify(item));
      await this.getClient().coinGeckoResponse.upsert({
        where: { type: 'TRENDING_DATA' },
        update: { data: jsonData, updatedAt: now },
        create: {
          type: 'TRENDING_DATA',
          data: jsonData,
          createdAt: now,
          updatedAt: now,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getTopGainerLoserData(params: { page: number; pageSize: number }) {
    try {
      const lastUpdated = await this.getClient().coinGeckoResponse.findFirst({
        where: { type: 'TOPGAINERLOSER_DATA' },
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
          ) as CoinGeckoTopGainerLoserResponse[];
          const topGainers = paginate(
            parsedData[0].top_gainers,
            params.page,
            params.pageSize,
          );
          const topLosers = paginate(
            parsedData[0].top_losers,
            params.page,
            params.pageSize,
          );
          // return this.transformTopGainerLoserData(parsedData[0]);
          return new TopGainerLoserDataResponseDto({
            top_gainers: topGainers.items,
            top_losers: topLosers.items,
          });
        }
      }

      const response = await this.coingeckoService.getTopGainerLoserData(
        this.topGainerLoserParams,
      );
      const topGainerLoserData = this.transformTopGainerLoserData(response);

      await this.saveTopGainerLoserData(topGainerLoserData);

      const topGainers = paginate(
        topGainerLoserData.top_gainers,
        params.page,
        params.pageSize,
      );
      const topLosers = paginate(
        topGainerLoserData.top_losers,
        params.page,
        params.pageSize,
      );
      return new TopGainerLoserDataResponseDto({
        top_gainers: topGainers.items,
        top_losers: topLosers.items,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private transformTopGainerLoserData(
    data: CoinGeckoTopGainerLoserResponse,
  ): TopGainerLoserDataResponseDto {
    const topGainers = data.top_gainers.map(
      (coin) => new TopGainerLoserResponseDto(coin),
    );
    const topLosers = data.top_losers.map(
      (coin) => new TopGainerLoserResponseDto(coin),
    );

    return new TopGainerLoserDataResponseDto({
      top_gainers: topGainers,
      top_losers: topLosers,
    });
  }

  private async saveTopGainerLoserData(data: TopGainerLoserDataResponseDto) {
    try {
      const now = new Date();
      const jsonData = JSON.stringify(data);
      await this.getClient().coinGeckoResponse.upsert({
        where: { type: 'TOPGAINERLOSER_DATA' },
        update: { data: [jsonData], updatedAt: now },
        create: {
          type: 'TOPGAINERLOSER_DATA',
          data: [jsonData],
          createdAt: now,
          updatedAt: now,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getSingleCoinData(id: string) {
    try {
      const response = await this.coingeckoService.getSingleCoinData(
        id,
        this.singleCoinDataparams,
      );
      return response;
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
