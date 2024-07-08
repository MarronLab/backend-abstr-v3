import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { MarketService } from '../service/market.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseValidationInterceptor } from '../../../schema/market/market.validation';
import {
  MarketDataResponseDto,
  TrendingMarketDataResponseDto,
} from '../dto/market.dto';

@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService) {}

  @Get('coins')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(ResponseValidationInterceptor)
  @ApiOperation({ summary: 'Fetch market data' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The market data has been successfully fetched.',
    type: [MarketDataResponseDto],
  })
  async getMarketData() {
    const marketData = await this.marketService.getMarketData();
    console.log(marketData);
    if (!marketData) {
      return [];
    }
    return marketData.map((data) => new MarketDataResponseDto(data));
  }

  @Get('trending')
  @ApiOperation({ summary: 'Fetch trending market coins data' })
  @ApiOkResponse({
    description: 'The trending market coin data has been successfully fetched.',
    type: [TrendingMarketDataResponseDto],
  })
  async getTrendingCoin() {
    return await this.marketService.trendingMarket();
  }
}
