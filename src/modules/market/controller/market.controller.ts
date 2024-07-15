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
import MarketResponseValidationInterceptor from '../../../schema/market/market.validation';
import {
  trendingMarketSchema,
  topGainerLoserDataSchema,
} from '../../../schema/market/market.schema';
import { ResponseValidationInterceptor } from '../../../common/response-validator.interceptor';
import {
  MarketDataResponseDto,
  TrendingMarketDataResponseDto,
  TopGainerLoserDataResponseDto,
} from '../dto/market.dto';

@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService) {}

  @Get('coins')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(MarketResponseValidationInterceptor)
  @ApiOperation({ summary: 'Fetch market data' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The market data has been successfully fetched.',
    type: [MarketDataResponseDto],
  })
  async getMarketData() {
    const marketData = await this.marketService.getMarketData();
    if (!marketData) {
      return [];
    }
    return marketData.map((data) => new MarketDataResponseDto(data));
  }

  @Get('trending')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(trendingMarketSchema))
  @ApiOperation({ summary: 'Fetch trending market coins data' })
  @ApiOkResponse({
    description: 'The trending market coin data has been successfully fetched.',
    type: [TrendingMarketDataResponseDto],
  })
  async getTrendingCoin() {
    const trendingData = await this.marketService.trendingMarket();
    if (!trendingData) {
      return [];
    }
    return trendingData.map((data) => new TrendingMarketDataResponseDto(data));
  }

  @Get('top_gainers_losers')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(topGainerLoserDataSchema))
  @ApiOperation({ summary: 'Fetch 1000 top coin gainers and loser data' })
  @ApiOkResponse({
    description:
      'The top gainer and loser market coin data has been successfully fetched.',
    type: [TopGainerLoserDataResponseDto],
  })
  async getTopGainerLoserCoin() {
    const topGainerLoserData = await this.marketService.getTopGainerLoserData();
    if (!topGainerLoserData) {
      return new TopGainerLoserDataResponseDto({
        top_gainers: [],
        top_losers: [],
      });
    }
    return topGainerLoserData;
  }
}
