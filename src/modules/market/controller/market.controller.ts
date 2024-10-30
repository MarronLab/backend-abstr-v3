import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
  Param,
  Query,
} from '@nestjs/common';
import { MarketService } from '../service/market.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  trendingMarketSchema,
  topGainerLoserDataSchema,
  SingleCoinGeckoDataResponseSchema,
  marketDataSchema,
} from '../../../schema/market/market.schema';
import { ResponseValidationInterceptor } from '../../../common/response-validator.interceptor';
import {
  MarketDataResponseDto,
  TrendingMarketDataResponseDto,
  TopGainerLoserDataResponseDto,
  PaginationQueryDto,
  ForexQueryDto,
} from '../dto/market.dto';
import { SingleCoinGeckoDataResponseDto } from '../dto/singlecoinResponse.dto';
import { RecentAddedCoinsResponseDto } from '../dto/recentaddedcoinResponse.dto';
import { ApiMarketDataQueries } from '../dto/marketDataQuery.decorator';

@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService) {}

  @Get('coins')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(marketDataSchema))
  @ApiOperation({ summary: 'Fetch market data' })
  @ApiMarketDataQueries()
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The market data has been successfully fetched.',
    type: [MarketDataResponseDto],
  })
  async getMarketData(@Query() query: PaginationQueryDto) {
    const marketData = await this.marketService.getMarketData(query);
    if (!marketData) {
      return [];
    }
    return marketData.items.map((data) => new MarketDataResponseDto(data));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(trendingMarketSchema))
  @Get('trending')
  @ApiOperation({ summary: 'Fetch trending market coins data' })
  @ApiOkResponse({
    description: 'The trending market coin data has been successfully fetched.',
    type: [TrendingMarketDataResponseDto],
  })
  @ApiMarketDataQueries()
  async getTrendingCoin(@Query() query: PaginationQueryDto) {
    const trendingData = await this.marketService.trendingMarket(query);

    if (!trendingData) {
      return [];
    }
    return trendingData.items.map(
      (data) => new TrendingMarketDataResponseDto(data),
    );
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
  @ApiMarketDataQueries()
  async getTopGainerLoserCoin(@Query() query: PaginationQueryDto) {
    const topGainerLoserData =
      await this.marketService.getTopGainerLoserData(query);

    if (!topGainerLoserData) {
      return new TopGainerLoserDataResponseDto({
        top_gainers: [],
        top_losers: [],
      });
    }
    return topGainerLoserData;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(SingleCoinGeckoDataResponseSchema),
  )
  @Get('coins/:id')
  @ApiOperation({
    summary: 'This endpoint allows you to query all the coin data of a coin',
  })
  @ApiOkResponse({
    description: 'The coin data has been successfully fetched.',
    type: [SingleCoinGeckoDataResponseDto],
  })
  async getSingleCoinData(@Param('id') id: string) {
    const response = await this.marketService.getSingleCoinData(id);
    const dtoResponse = new SingleCoinGeckoDataResponseDto();
    Object.assign(dtoResponse, response);
    return dtoResponse;
  }

  @Get('newlistedcoins')
  @ApiOperation({
    summary: 'This endpoint allows you to query all recent added coins',
  })
  @ApiOkResponse({
    description: 'The newlisted coin data has been successfully fetched.',
    type: [RecentAddedCoinsResponseDto],
  })
  @ApiMarketDataQueries()
  async getRecentAddedCoins(@Query() query: PaginationQueryDto) {
    const response = await this.marketService.getRecentAddedCoins(query);
    return response;
  }

  @Get('forex-exchange')
  @ApiOperation({
    summary: 'This endpoint allows you to query forex',
  })
  async getForexExchange(@Query() query: ForexQueryDto) {
    const response = await this.marketService.getForexExchange(query);
    return response;
  }
}
