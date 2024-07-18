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
  ApiQuery,
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
  GetMarketDataQueryDto,
  PaginationQueryDto,
} from '../dto/market.dto';
import { SingleCoinGeckoDataResponseDto } from '../dto/singlecoinResponse.dto';
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
  async getMarketData(@Query() query: GetMarketDataQueryDto) {
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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default is 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Page size (default is 10)',
  })
  async getTrendingCoin(@Query() query: PaginationQueryDto) {
    const params = {
      page: query.page ?? 1,
      per_page: query.pageSize ?? 10,
    };
    const trendingData = await this.marketService.trendingMarket(params);

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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default is 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Page size (default is 10)',
  })
  async getTopGainerLoserCoin(@Query() query: PaginationQueryDto) {
    const params = {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 10,
    };
    const topGainerLoserData =
      await this.marketService.getTopGainerLoserData(params);

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
}
