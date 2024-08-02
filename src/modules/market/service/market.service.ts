import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import Bottleneck from 'bottleneck';

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
  PaginationQueryDto,
} from '../dto/market.dto';

import { RecentAddedCoinDto } from '../dto/recentaddedcoinResponse.dto';

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

  private readonly limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 200,
  });

  constructor(
    private readonly coingeckoService: CoingeckoService,
    private readonly modulusService: ModulusService,
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) req: Request,
  ) {
    super(prismaService, req);
  }

  async getMarketData(queryParams: PaginationQueryDto) {
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
  async trendingMarket(queryParams: PaginationQueryDto) {
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
          const trendingData = await this.addSparklineData(parsedData);
          return paginate(
            trendingData,
            queryParams.page ?? 1,
            queryParams.per_page ?? 10,
          );
        }
      }

      const response = await this.coingeckoService.getTrendingMarketData();
      const trendingData = await this.addSparklineData(response.coins);

      await this.saveTrendingMarketData(trendingData);
      return paginate(
        trendingData,
        queryParams.page ?? 1,
        queryParams.per_page ?? 10,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  private async addSparklineData(
    data: CoingeckoTrendingItem[],
  ): Promise<TrendingMarketDataResponseDto[]> {
    const trendingDataWithSparkline = [];

    for (const coin of data) {
      const item = coin.item || coin;
      const singleCoinData = await this.coingeckoService.getSingleCoinData(
        item.id,
        this.singleCoinDataparams,
      );

      const sparklineData =
        singleCoinData?.market_data?.sparkline_in_7d?.price ?? [];

      trendingDataWithSparkline.push(
        new TrendingMarketDataResponseDto({
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
            price: singleCoinData.market_data.current_price.usd,
            price_btc: singleCoinData.market_data.current_price.btc,
            price_change_percentage_24h: {
              btc: singleCoinData.market_data
                .price_change_percentage_24h_in_currency.btc,
              usd: singleCoinData.market_data
                .price_change_percentage_24h_in_currency.usd,
            },
            market_cap: singleCoinData.market_data.market_cap.usd,
            market_cap_btc: singleCoinData.market_data.market_cap.btc,
            total_volume: singleCoinData.market_data.total_volume.usd,
            total_volume_btc: singleCoinData.market_data.total_volume.btc,
            sparkline_in_7d: {
              price: sparklineData,
            },
          },
        }),
      );
    }

    return trendingDataWithSparkline;
  }

  private async saveTrendingMarketData(data: TrendingMarketDataResponseDto[]) {
    try {
      const now = new Date();
      const jsonData = data.map((item) => JSON.stringify(item));
      console.log('Saving trending data to DB', jsonData);
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

  async getTopGainerLoserData(queryParams: PaginationQueryDto) {
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
        console.log('db response', lastUpdated);

        if (diffHours < 1) {
          const parsedData = lastUpdated.data.map((item: string) =>
            JSON.parse(item),
          ) as CoinGeckoTopGainerLoserResponse[];
          const topGainers = paginate(
            parsedData[0].top_gainers,
            queryParams.page ?? 1,
            queryParams.per_page ?? 10,
          );
          const topLosers = paginate(
            parsedData[0].top_losers,
            queryParams.page ?? 1,
            queryParams.per_page ?? 10,
          );
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
        queryParams.page ?? 1,
        queryParams.per_page ?? 10,
      );
      const topLosers = paginate(
        topGainerLoserData.top_losers,
        queryParams.page ?? 1,
        queryParams.per_page ?? 10,
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

  async getRecentAddedCoins(queryParams: PaginationQueryDto) {
    try {
      const lastUpdated = await this.getClient().coinGeckoResponse.findFirst({
        where: { type: 'NEWLISTED_DATA' },
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
          );
          return paginate(
            parsedData,
            queryParams.page ?? 1,
            queryParams.per_page ?? 10,
          );
        }
      }

      const recentCoins = await this.coingeckoService.getRecentAddedCoins();

      if (!Array.isArray(recentCoins) || recentCoins.length === 0) {
        throw new HttpException(
          'Failed to fetch recent coins data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const results = await this.processAndSaveNewCoins(recentCoins);

      return paginate(
        results,
        queryParams.page ?? 1,
        queryParams.per_page ?? 10,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async processAndSaveNewCoins(
    recentCoins: any,
  ): Promise<RecentAddedCoinDto[]> {
    const results = await Promise.all(
      recentCoins.map((coin: any) =>
        this.limiter.schedule(() =>
          this.coingeckoService.getSingleCoinData(
            coin.id,
            this.singleCoinDataparams,
          ),
        ),
      ),
    );

    const transformedData = results
      .filter((item) => item !== null)
      .map((coin) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image.large,
        current_price: coin.market_data.current_price.usd,
        high_24h: coin.market_data.high_24h.usd,
        low_24h: coin.market_data.low_24h.usd,
        price_change_percentage_24h:
          coin.market_data.price_change_percentage_24h,
        price_change_24h: coin.market_data.price_change_24h,
      }));

    try {
      const now = new Date();
      await this.getClient().coinGeckoResponse.upsert({
        where: { type: 'NEWLISTED_DATA' },
        update: { data: transformedData, updatedAt: now },
        create: {
          type: 'NEWLISTED_DATA',
          data: transformedData,
          createdAt: now,
          updatedAt: now,
        },
      });
    } catch (error) {
      throw error;
    }

    const response = transformedData.map(
      (data) => new RecentAddedCoinDto(data),
    );
    return response;
  }

  private handleError(error: any): void {
    throw new HttpException(
      error.response?.data?.message || error.message,
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
