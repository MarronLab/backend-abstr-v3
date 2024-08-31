import {
  Injectable,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { CoingeckoService } from 'src/services/coingecko/coingecko.service';
import { MarketSummaryPairData } from 'src/services/modulus/modulus.type';
import { mockStats } from './mockStats';

@Injectable()
export class SettingsService {
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
      // Fetch primary settings
      const { data: primarySettings } = await this.modulusService.getSettings();

      // Check for error status in primary settings
      if (primarySettings.status === 'Error') {
        throw new UnprocessableEntityException(primarySettings.data);
      }

      // Fetch additional settings
      const { data: currencySettings } =
        await this.modulusService.getCurrencySettings();
      const { data: marketSummary } =
        await this.modulusService.getMarketSummary();

      const { data: coinStatsData } = await this.modulusService.getCoinStats();

      // Filter supported currencies
      const supportedCurrencies = currencySettings.data.filter(
        (currency) => currency.networkName === 'Base',
      );

      const supportedAssets = (
        await Promise.all(
          primarySettings.data.trade_setting.map(async (tradeSetting) => {
            try {
              const currency = supportedCurrencies.find(
                (c) => c.shortName === tradeSetting.coinName,
              );

              const stats =
                coinStatsData.data[tradeSetting.coinName.toLowerCase()] ||
                mockStats;

              if (coinStatsData.data[tradeSetting.coinName.toLowerCase()]) {
                // Fetch sparkline data if real stats exist
                const coinGeckoData =
                  await this.coingeckoService.getSingleCoinData(
                    stats.slug,
                    this.singleCoinDataParams,
                  );
                const sparklineData =
                  coinGeckoData?.market_data?.sparkline_in_7d?.price ?? [];
                stats.sparkline_in_7d = { price: sparklineData };
              }
              return currency ? { ...currency, ...tradeSetting, stats } : null;
            } catch (err) {
              console.error(
                'Error processing trade setting',
                tradeSetting,
                err,
              );
              return null;
            }
          }),
        )
      ).filter((setting) => setting !== null);

      const supportedPairs = Object.keys(marketSummary.data).reduce(
        (acc, pair) => {
          // Extract currency symbol from pair (assuming pair is in format "BASE_QUOTE")
          const quoteCurrency = pair.split('_')[1];

          // Find if the currency is in the supported list
          const currency = supportedCurrencies.find(
            (c) => c.shortName === quoteCurrency,
          );

          const assetTradeSetting = supportedAssets.find(
            (t) => t?.coinName === quoteCurrency,
          );

          // If currency is found, add the pair to the result object
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

      return {
        supportedPairs,
        supportedAssets,
        generalSettings: primarySettings.data,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
