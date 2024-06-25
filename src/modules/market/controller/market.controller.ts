import { Controller, Get, UseInterceptors, Param } from '@nestjs/common';
import { MarketService } from '../service/market.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseValidationInterceptor } from '../../../schema/market/market.validation';

@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService) {}

  @Get('coins')
  @UseInterceptors(ResponseValidationInterceptor)
  async getMarketData() {
    return await this.marketService.getMarketData();
  }

  @Get('coin/:id')
  getCoinInfo(@Param('id') id: string) {
    return this.marketService.getCoinById(id);
  }
}
