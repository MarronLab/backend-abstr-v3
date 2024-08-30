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
import { CoinGeckoResponseType } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class MarketService extends BaseService {
  private static readonly UPDATE_INTERVAL_HOURS = 1;
  private static readonly MARKET_DATA_TYPE = 'MARKET_DATA';
  private static readonly TRENDING_DATA_TYPE = 'TRENDING_DATA';
  private static readonly TOPGAINERLOSER_DATA_TYPE = 'TOPGAINERLOSER_DATA';
  private static readonly NEWLISTED_DATA_TYPE = 'NEWLISTED_DATA';

  private readonly marketDataParams = {
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

  private readonly singleCoinDataParams = {
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
      const cachedData = await this.getCachedData(
        MarketService.MARKET_DATA_TYPE,
      );

      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as any[];
        return this.paginateData(parsedData, queryParams);
      }

      const response = await this.coingeckoService.getMarketData(
        this.marketDataParams,
      );
      const filteredResponse = await this.filterSupportedCoins(response);
      const marketData = this.transformResponse(filteredResponse);

      await this.saveData(MarketService.MARKET_DATA_TYPE, marketData);
      return this.paginateData(marketData, queryParams);
    } catch (error) {
      this.handleError(error);
    }
  }

  async trendingMarket(queryParams: PaginationQueryDto) {
    try {
      const cachedData = await this.getCachedData(
        MarketService.TRENDING_DATA_TYPE,
      );
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as any[];
        return this.paginateData(parsedData, queryParams);
      }

      const response = await this.coingeckoService.getTrendingMarketData();
      const filteredResponse = await this.filterSupportedCoins(response.coins);
      const trendingData = await this.addSparklineData(filteredResponse);

      await this.saveData(MarketService.TRENDING_DATA_TYPE, trendingData);
      return this.paginateData(trendingData, queryParams);
    } catch (error) {
      this.handleError(error);
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

      const getMarketDatalist = await this.coingeckoService.getMarketData(
        this.marketDataParams,
      );
      const detailedDataPromises = getMarketDatalist.map(async (coin) => {
        const coinData = await this.getSingleCoinData(coin.id);
        return coinData;
      });

      const detailedCoins = await Promise.all(detailedDataPromises);

      const allmarketsummary = await this.modulusService.getMarketSummary();

      const supportpairs = this.extractPairs(allmarketsummary.data);

      const detailedCoinPairs = detailedCoins
        .map((coin) => {
          return coin?.tickers.map((ticker) =>
            this.normalizePair(ticker.base, ticker.target),
          );
        })
        .flat();

      const uniqueDetailedCoinPairs = [...new Set(detailedCoinPairs)];
      const matchingCoinIds = new Set<string>();

      for (const pair of supportpairs) {
        const [base, target] = pair.split('_');
        const normalizedPair = this.normalizePair(base, target);

        const isPairInUnique = uniqueDetailedCoinPairs.includes(normalizedPair);

        if (isPairInUnique) {
          const matchingCoin = detailedCoins.find((coin) =>
            coin?.tickers.some(
              (ticker) =>
                this.normalizePair(ticker.base, ticker.target) ===
                normalizedPair,
            ),
          );
          if (matchingCoin) {
            matchingCoinIds.add(matchingCoin.id);
          }
        }
      }
      const uniqueMatchingCoinIds = Array.from(matchingCoinIds);

      const response = await this.coingeckoService.getTopGainerLoserData(
        this.topGainerLoserParams,
      );

      const filteredTopGainers = response.top_gainers.filter((coin) =>
        uniqueMatchingCoinIds.includes(coin.id),
      );
      const filteredTopLosers = response.top_losers.filter((coin) =>
        uniqueMatchingCoinIds.includes(coin.id),
      );

      const topGainerLoserData = this.transformTopGainerLoserData({
        top_gainers: filteredTopGainers,
        top_losers: filteredTopLosers,
      });

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
      return await this.coingeckoService.getSingleCoinData(
        id,
        this.singleCoinDataParams,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async getRecentAddedCoins(queryParams: PaginationQueryDto) {
    try {
      const cachedData = await this.getCachedData(
        MarketService.NEWLISTED_DATA_TYPE,
      );
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as any[];
        return this.paginateData(parsedData, queryParams);
      }

      const recentCoins = await this.coingeckoService.getRecentAddedCoins();
      if (!Array.isArray(recentCoins) || recentCoins.length === 0) {
        return [];
      }

      const filteredRecentCoins = await this.filterSupportedCoins(recentCoins);
      const results = await this.processAndSaveNewCoins(filteredRecentCoins);

      return this.paginateData(results, queryParams);
    } catch (error) {
      this.handleError(error);
    }
  }

  private async getCachedData(
    type: CoinGeckoResponseType,
  ): Promise<string | null> {
    const lastUpdated = await this.getClient().coinGeckoResponse.findFirst({
      where: { type },
      orderBy: { updatedAt: 'desc' },
    });

    if (lastUpdated && this.isDataFresh(lastUpdated.updatedAt)) {
      if (typeof lastUpdated.data === 'string') {
        return lastUpdated.data;
      } else {
        console.error('Cached data is not a JSON string.');
        return null;
      }
    }

    return null;
  }

  private isDataFresh(updatedAt: Date): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - updatedAt.getTime();
    const diffHours = timeDiff / (1000 * 3600);
    return diffHours < MarketService.UPDATE_INTERVAL_HOURS;
  }

  private async saveData(type: CoinGeckoResponseType, data: any) {
    const now = new Date();
    const jsonData = JSON.stringify(data);

    await this.getClient().coinGeckoResponse.upsert({
      where: { type },
      update: { data: JSON.parse(jsonData), updatedAt: now },
      create: {
        type,
        data: JSON.parse(jsonData),
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  private async filterSupportedCoins(coins: any[]) {
    const supportedPairs = await this.getSupportedPairs();
    const detailedDataPromises = coins.map(async (coin) => {
      const coinId = coin.item ? coin.item.id : coin.id;
      const coinData = await this.getSingleCoinData(coinId);
      return coinData;
    });

    const detailedCoins = await Promise.all(detailedDataPromises);
    const detailedCoinPairs = detailedCoins
      .map((coin) => {
        return coin?.tickers.map((ticker) =>
          this.normalizePair(ticker.base, ticker.target),
        );
      })
      .flat();

    const uniqueDetailedCoinPairs = [...new Set(detailedCoinPairs)];
    const matchingCoinIds = new Set<string>();

    for (const pair of supportedPairs) {
      const [base, target] = pair.split('_');
      const normalizedPair = this.normalizePair(base, target);

      const isPairInUnique = uniqueDetailedCoinPairs.includes(normalizedPair);

      if (isPairInUnique) {
        const matchingCoin = detailedCoins.find((coin) =>
          coin?.tickers.some(
            (ticker) =>
              this.normalizePair(ticker.base, ticker.target) === normalizedPair,
          ),
        );
        if (matchingCoin) {
          matchingCoinIds.add(matchingCoin.id);
        }
      }
    }

    return coins.filter((coin) => matchingCoinIds.has(coin.id));
  }
  private async getSupportedPairs() {
    const allMarketSummary = await this.modulusService.getMarketSummary();
    return this.extractPairs(allMarketSummary.data);
  }

  private extractPairs(marketSummary: any): string[] {
    if (!marketSummary || !marketSummary.data) {
      console.error('Invalid market summary response.');
      return [];
    }

    return Object.keys(marketSummary.data).map((pair: string) => {
      const [base, target] = pair.split('_');
      return this.normalizePair(base, target);
    });
  }

  private normalizePair(base: string, target: string): string {
    const sortedComponents = [base, target].sort();
    return `${sortedComponents[0]}_${sortedComponents[1]}`.toUpperCase();
  }

  private paginateData(data: any[], queryParams: PaginationQueryDto) {
    return paginate(data, queryParams.page ?? 1, queryParams.per_page ?? 10);
  }

  private handleError(error: any): void {
    throw new HttpException(
      error.response?.data?.message || error.message,
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
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
            price: Array.isArray(coin.sparkline_in_7d?.price)
              ? coin.sparkline_in_7d.price
              : [],
          },
          watchlist: false,
        }),
    );
  }

  private toNumberOrNull(value: any): number | null {
    return value === null || value === undefined ? null : Number(value);
  }

  private async addSparklineData(
    data: CoingeckoTrendingItem[],
  ): Promise<TrendingMarketDataResponseDto[]> {
    const trendingDataWithSparkline = [];

    for (const coin of data) {
      const item = coin.item || coin;
      const singleCoinData = await this.coingeckoService.getSingleCoinData(
        item.id,
        this.singleCoinDataParams,
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

  private async processAndSaveNewCoins(
    recentCoins: any,
  ): Promise<RecentAddedCoinDto[]> {
    const results = await Promise.all(
      recentCoins.map((coin: any) =>
        this.limiter.schedule(() =>
          this.coingeckoService.getSingleCoinData(
            coin.id,
            this.singleCoinDataParams,
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

    await this.saveData(MarketService.NEWLISTED_DATA_TYPE, transformedData);

    return transformedData.map((data) => new RecentAddedCoinDto(data));
  }
}
