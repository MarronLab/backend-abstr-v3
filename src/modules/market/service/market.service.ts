import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  MarketDataResponseDto,
  TrendingMarketDataResponseDto,
} from '../dtos/market.dto';

@Injectable()
export class MarketService {
  private readonly endpoint = 'coins/markets';
  private readonly trending = 'search/trending';
  private readonly params = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 10,
    page: 1,
    sparkline: true,
  };

  constructor(private readonly httpService: HttpService) {}

  async getMarketData() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.endpoint, { params: this.params }),
      );
      return this.transformResponse(response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  private transformResponse(data: any[]) {
    return data.map(
      (coin) =>
        new MarketDataResponseDto({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          market_cap_rank: coin.market_cap_rank,
          sparkline_in_7d: coin.sparkline_in_7d?.price || [],
          price_change_percentage_24h: coin.price_change_percentage_24h,
        }),
    );
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
