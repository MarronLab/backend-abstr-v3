import { Module } from '@nestjs/common';
import { MarketService } from '../service/market.service';
import { MarketController } from '../controller/market.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/services/prisma.service';
import { CoingeckoService } from 'src/services/coingecko/coingecko.service';
import { ModulusService } from 'src/services/modulus/modulus.service';

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
  providers: [MarketService, PrismaService, CoingeckoService, ModulusService],
  exports: [MarketService],
})
export class MarketModule {}
