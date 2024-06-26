import { Controller, Get, UseInterceptors, Param, Query } from '@nestjs/common';
import { MarketService } from '../service/market.service';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ResponseValidationInterceptor } from '../../../schema/market/market.validation';
import { MarketResponseDto } from '../dto/marketcoinsResponse.dto';
import { MarketDataQueryParams } from '../dto/marketQueryParam.dto';

@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService) {}

  @Get('coins')
  @UseInterceptors(ResponseValidationInterceptor)
  @ApiOkResponse({ type: [MarketResponseDto] })
  @ApiQuery({ type: MarketDataQueryParams, required: false })
  async getMarketData(@Query() queryParams: MarketDataQueryParams) {
    return await this.marketService.getMarketData(queryParams);
  }

  @Get('coin/:id')
  getCoinInfo(@Param('id') id: string) {
    return this.marketService.getCoinById(id);
  }
}
