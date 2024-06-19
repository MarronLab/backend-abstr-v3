import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ValidationService } from '../../../schema/market/market.validation';

@Injectable()
export class MarketService {
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
    private readonly validationService: ValidationService,
  ) {}

  async getMarketData() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.endpoint, { params: this.params }),
      );
      const transformedData = this.transformResponse(response.data);

      this.validationService.validateData(transformedData);

      return transformedData;
    } catch (error) {
      this.handleError(error);
    }
  }

  private transformResponse(data: any[]) {
    return data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      sparkline_in_7d: coin.sparkline_in_7d?.price || [],
      price_change_percentage_24h: coin.price_change_percentage_24h,
    }));
  }

  private handleError(error: any): void {
    throw new HttpException(
      error.response?.data?.message || error.message,
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
