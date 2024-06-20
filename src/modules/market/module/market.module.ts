import { Module } from '@nestjs/common';
import { MarketService } from '../service/module.service';
import { MarketController } from '../controller/market.controller';
import { ValidationService } from '../../../schema/market/market.validation';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.coingecko.com/api/v3/',
    }),
  ],
  controllers: [MarketController],
  providers: [MarketService, ValidationService],
  exports: [MarketService],
})
export class MarketModule {}
