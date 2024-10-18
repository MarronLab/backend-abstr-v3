import {
  Injectable,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { CoingeckoService } from 'src/services/coingecko/coingecko.service';
import {
  GetCurrencySettingsResponse,
  GetSettingsResponse,
  MarketSummaryResponse,
  GetCoinStatsResponse,
  MarketSummaryPairData,
} from 'src/services/modulus/modulus.type';
import { TradeSettingDto } from './dto/trade_setting.dto';
import { mockStats } from './mockStats';

@Injectable()
export class SettingsService {
  private readonly NETWORK = 'Base Sepolia';

  constructor(
    private readonly modulusService: ModulusService,
    private readonly coingeckoService: CoingeckoService,
  ) {}

  private readonly singleCoinDataParams = {
    localization: false,
    community_data: false,
    developer_data: false,
    sparkline: true,
  };

  async getApiSettings() {
    try {
      const primarySettings = await this.getPrimarySettings();
      const currencySettings = await this.getCurrencySettings();
      const marketSummary = await this.getMarketSummary();
      const coinStatsData = await this.getCoinStats();

      const supportedCurrencies = this.getSupportedCurrencies(currencySettings);
      const supportedAssets = await this.getSupportedAssets(
        primarySettings,
        supportedCurrencies,
        coinStatsData,
      );

      const supportedPairs = this.buildSupportedPairs(
        marketSummary,
        supportedCurrencies,
        supportedAssets,
      );

      return {
        supportedPairs,
        supportedAssets,
        generalSettings: primarySettings.data,
      };
    } catch (error) {
      console.error(`Failed to get API settings: ${error.message}`);
      throw new InternalServerErrorException(
        'An unexpected error occurred while processing your request.',
      );
    }
  }

  private async getPrimarySettings(): Promise<GetSettingsResponse> {
    const { data: primarySettings } = await this.modulusService.getSettings();
    if (primarySettings.status === 'Error') {
      throw new UnprocessableEntityException(primarySettings.message);
    }
    return primarySettings;
  }

  private async getCurrencySettings(): Promise<
    GetCurrencySettingsResponse['data']
  > {
    const { data } = await this.modulusService.getCurrencySettings();
    if (data.status === 'Error') {
      throw new UnprocessableEntityException(data.message);
    }
    return data.data;
  }

  private async getMarketSummary(): Promise<MarketSummaryResponse> {
    const { data } = await this.modulusService.getMarketSummary();
    return data;
  }

  private async getCoinStats(): Promise<GetCoinStatsResponse> {
    const { data } = await this.modulusService.getCoinStats();
    return data;
  }

  private getSupportedCurrencies(
    currencySettings: GetCurrencySettingsResponse['data'],
  ): GetCurrencySettingsResponse['data'] {
    return currencySettings.filter(
      (currency) => currency.networkName === this.NETWORK,
    );
  }

  private async getSupportedAssets(
    primarySettings: GetSettingsResponse,
    supportedCurrencies: GetCurrencySettingsResponse['data'],
    coinStatsData: GetCoinStatsResponse,
  ): Promise<any[]> {
    return (
      await Promise.all(
        primarySettings.data.trade_setting.map((tradeSetting) =>
          this.processTradeSetting(
            tradeSetting,
            supportedCurrencies,
            coinStatsData,
          ),
        ),
      )
    ).filter((setting) => setting !== null);
  }

  private async processTradeSetting(
    tradeSetting: TradeSettingDto,
    supportedCurrencies: GetCurrencySettingsResponse['data'],
    coinStatsData: GetCoinStatsResponse,
  ): Promise<any | null> {
    try {
      const currency = this.findCurrency(tradeSetting, supportedCurrencies);
      const stats = this.getStats(tradeSetting, coinStatsData);

      if (coinStatsData.data[tradeSetting.coinName.toLowerCase()]) {
        stats.sparkline_in_7d = await this.getSparklineData(stats);
      }

      return currency ? { ...currency, ...tradeSetting, stats } : null;
    } catch (err) {
      console.error('Error processing trade setting', err);
      return null;
    }
  }

  private findCurrency(
    tradeSetting: any,
    supportedCurrencies: GetCurrencySettingsResponse['data'],
  ): GetCurrencySettingsResponse['data'][number] | undefined {
    return supportedCurrencies.find(
      (c) => c.shortName === tradeSetting.coinName,
    );
  }

  private getStats(
    tradeSetting: any,
    coinStatsData: GetCoinStatsResponse,
  ): any {
    return coinStatsData.data[tradeSetting.coinName.toLowerCase()] || mockStats;
  }

  private async getSparklineData(stats: any): Promise<number[]> {
    try {
      const coinGeckoData = await this.coingeckoService.getSingleCoinData(
        stats.slug,
        this.singleCoinDataParams,
      );
      return coinGeckoData?.market_data?.sparkline_7d?.price ?? [];
    } catch (error) {
      console.error(
        `Error fetching sparkline data for slug ${stats.slug}: ${error.message}`,
      );
      return [];
    }
  }

  private buildSupportedPairs(
    marketSummary: MarketSummaryResponse,
    supportedCurrencies: GetCurrencySettingsResponse['data'],
    supportedAssets: any[],
  ): Record<string, MarketSummaryPairData> {
    return Object.keys(marketSummary.data).reduce(
      (acc, pair) => {
        const quoteCurrency = pair.split('_')[1];
        const currency = supportedCurrencies.find(
          (c) => c.shortName === quoteCurrency,
        );
        const assetTradeSetting = supportedAssets.find(
          (t) => t?.coinName === quoteCurrency,
        );

        if (currency) {
          acc[pair] = {
            ...marketSummary.data[pair],
            ...currency,
            ...assetTradeSetting,
          };
        }

        return acc;
      },
      {} as Record<string, MarketSummaryPairData>,
    );
  }
}
