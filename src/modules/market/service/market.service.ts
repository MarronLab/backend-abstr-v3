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
import { SettingsService } from 'src/modules/settings/settings.service';
import { CoinGeckoTopGainerLoserResponse } from '../../../services/coingecko/coingecko.type';
import {
  MarketDataResponseDto,
  TrendingMarketDataResponseDto,
  TopGainerLoserResponseDto,
  TopGainerLoserDataResponseDto,
  PaginationQueryDto,
  ForexQueryDto,
} from '../dto/market.dto';

import { RecentAddedCoinDto } from '../dto/recentaddedcoinResponse.dto';

import { paginate } from 'src/utils/pagination';
import { CoinGeckoResponseType } from '@prisma/client';
import { QuicknodeService } from 'src/services/quicknode/quicknode.service';

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
    private readonly quicknodeService: QuicknodeService,
    private readonly settingsService: SettingsService,
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

      const response = (await this.settingsService.getApiSettings())
        .supportedAssets;

      const marketData = this.transformResponse(response);

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

      const response = await this.settingsService.getApiSettings();
      const supportedAssetSlugs = response.supportedAssets
        .filter((asset): asset is NonNullable<typeof asset> => asset !== null)
        .map((asset) => asset.stats?.slug)
        .filter((slug): slug is string => slug !== undefined);

      const trendingResponse =
        await this.coingeckoService.getTrendingMarketData();
      const filteredResponse = await this.filterSupportedCoins(
        trendingResponse.coins,
        supportedAssetSlugs,
      );

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

      const response = await this.settingsService.getApiSettings();
      const supportedAssetSlugs = response.supportedAssets
        .filter((asset): asset is NonNullable<typeof asset> => asset !== null)
        .map((asset) => asset.stats?.slug)
        .filter((slug): slug is string => slug !== undefined);

      const topGainerLoserData =
        await this.coingeckoService.getTopGainerLoserData(
          this.topGainerLoserParams,
        );

      const filteredTopGainers = topGainerLoserData.top_gainers.filter((coin) =>
        supportedAssetSlugs.includes(coin.id),
      );
      const filteredTopLosers = topGainerLoserData.top_losers.filter((coin) =>
        supportedAssetSlugs.includes(coin.id),
      );

      const topGainerLoserDataTransformed = this.transformTopGainerLoserData({
        top_gainers: filteredTopGainers,
        top_losers: filteredTopLosers,
      });

      await this.saveTopGainerLoserData(topGainerLoserDataTransformed);

      const topGainers = paginate(
        topGainerLoserDataTransformed.top_gainers,
        queryParams.page ?? 1,
        queryParams.per_page ?? 10,
      );
      const topLosers = paginate(
        topGainerLoserDataTransformed.top_losers,
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

      const response = await this.settingsService.getApiSettings();

      const supportedAssetSlugs = response.supportedAssets
        .filter((asset): asset is NonNullable<typeof asset> => asset !== null)
        .map((asset) => asset.stats?.slug)
        .filter((slug): slug is string => slug !== undefined);

      const recentCoins = await this.coingeckoService.getRecentAddedCoins();
      if (!Array.isArray(recentCoins) || recentCoins.length === 0) {
        return [];
      }

      const filteredRecentCoins = await this.filterSupportedCoins(
        recentCoins,
        supportedAssetSlugs,
      );
      const results = await this.processAndSaveNewCoins(filteredRecentCoins);

      return this.paginateData(results, queryParams);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getForexExchange(queryParams: ForexQueryDto) {
    try {
      return await this.quicknodeService.getExchangeRate(queryParams.baseCurrency);
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

  private async filterSupportedCoins(coins: any[], supportedSlugs: string[]) {
    const filteredCoins = coins.filter((coin) => {
      const coinId = coin.item ? coin.item.id : coin.id;
      return supportedSlugs.includes(coinId);
    });
    const detailedDataPromises = filteredCoins.map(async (coin) => {
      const coinId = coin.item ? coin.item.id : coin.id;
      return this.getSingleCoinData(coinId);
    });

    const detailedCoins = await Promise.all(detailedDataPromises);
    return detailedCoins.filter(
      (coin): coin is NonNullable<typeof coin> => coin !== null,
    );
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

  private transformResponse(data: any[]): MarketDataResponseDto[] {
    return data.map(
      (coin) =>
        new MarketDataResponseDto({
          id: coin.stats?.slug || '',
          symbol: coin.shortName || '',
          name: coin.fullName || '',
          image: coin.stats?.image || '',
          current_price: this.toNumberOrNull(coin.stats?.price) || 0,
          market_cap: this.toNumberOrNull(coin.stats?.marketCap) || 0,
          market_cap_rank: this.toNumberOrNull(coin.stats?.rank) || 0,
          fully_diluted_valuation:
            (this.toNumberOrNull(coin.stats?.maxSupply) ?? 0) *
              (this.toNumberOrNull(coin.stats?.price) ?? 0) || 0,

          total_volume: this.toNumberOrNull(coin.stats?.volume24h) || 0,
          high_24h: 0,
          low_24h: 0,
          price_change_24h:
            this.toNumberOrNull(coin.stats?.priceChangePercent24hr) || 0,
          price_change_percentage_24h:
            this.toNumberOrNull(coin.stats?.priceChangePercent24hr) || 0,
          market_cap_change_24h: 0,
          market_cap_change_percentage_24h: 0,
          circulating_supply:
            this.toNumberOrNull(coin.stats?.circulatingSupply) || 0,
          total_supply: this.toNumberOrNull(coin.stats?.maxSupply) || 0,
          max_supply: this.toNumberOrNull(coin.stats?.maxSupply) || 0,
          ath: 0,
          ath_change_percentage: 0,
          ath_date: '',
          atl: 0,
          atl_change_percentage: 0,
          atl_date: '',
          last_updated: coin.stats?.lastUpdated || '',
          sparkline_in_7d: {
            price: Array.isArray(coin.stats?.sparkline?.price)
              ? coin.stats.sparkline.price
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
    data: any[],
  ): Promise<TrendingMarketDataResponseDto[]> {
    const trendingDataWithSparkline = [];

    for (const coin of data) {
      const item = coin.item || coin;
      const singleCoinData = await this.coingeckoService.getSingleCoinData(
        item.id,
        this.singleCoinDataParams,
      );

      const sparklineData =
        singleCoinData?.market_data?.sparkline_7d?.price ?? [];
      const marketData = singleCoinData?.market_data ?? {};

      trendingDataWithSparkline.push(
        new TrendingMarketDataResponseDto({
          id: item.id ?? 0,
          coin_id: item.coin_id ?? 0,
          name: item.name,
          symbol: item.symbol,
          market_cap_rank: item.market_cap_rank,
          thumb: item.image?.thumb ?? '',
          small: item.image?.small ?? '',
          large: item.image?.large ?? '',
          price_btc: marketData.current_price?.btc ?? 0,
          score: item.score ?? 0,
          data: {
            price: marketData.current_price?.usd ?? 0,
            price_btc: marketData.current_price?.btc ?? 0,
            price_change_percentage_24h: {
              btc: marketData.price_change_percentage_24h_in_currency?.btc ?? 0,
              usd: marketData.price_change_percentage_24h_in_currency?.usd ?? 0,
            },
            market_cap: marketData.market_cap?.usd ?? 0,
            market_cap_btc: marketData.market_cap?.btc ?? 0,
            total_volume: marketData.total_volume?.usd ?? 0,
            total_volume_btc: marketData.total_volume?.btc ?? 0,
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
