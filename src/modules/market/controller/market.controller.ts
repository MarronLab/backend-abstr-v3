import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { MarketService } from '../service/market.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseValidationInterceptor } from '../../../schema/market/market.validation';

@ApiTags('market')
@Controller('market')
@UseInterceptors(ResponseValidationInterceptor)
export class MarketController {
  constructor(private marketService: MarketService) {}

  @Get('coins')
  async getMarketData() {
    return await this.marketService.getMarketData();
  }
}
