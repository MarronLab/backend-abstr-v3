import { Module } from '@nestjs/common';
import { MarketService } from '../service/market.service';
import { MarketController } from '../controller/market.controller';
import { ResponseValidationInterceptor } from '../../../schema/market/market.validation';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://pro-api.coingecko.com/api/v3/',
      headers: {
        'X-CG-Pro-API-Key': process.env.COINGECKO_API_KEY,
      },
    }),
  ],
  controllers: [MarketController],
  providers: [MarketService, ResponseValidationInterceptor, PrismaService],
  exports: [MarketService],
})
export class MarketModule {}
