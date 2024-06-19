import { Controller, Get } from '@nestjs/common';
import { MarketService } from '../service/module.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService) {}

  @Get('coins')
  async getMarketData() {
    return await this.marketService.getMarketData();
  }
}
