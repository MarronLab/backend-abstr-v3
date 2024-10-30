import { Module } from '@nestjs/common';
import { MarketService } from '../service/market.service';
import { MarketController } from '../controller/market.controller';
import { PrismaService } from 'src/services/prisma.service';
import { CoingeckoModule } from 'src/services/coingecko/coingecko.module';
import { ModulusModule } from 'src/services/modulus/modulus.module';
import { SettingsModule } from 'src/modules/settings/settings.module';
import { QuicknodeModule } from 'src/services/quicknode/quicknode.module';

@Module({
  imports: [CoingeckoModule, ModulusModule, QuicknodeModule, SettingsModule],
  controllers: [MarketController],
  providers: [MarketService, PrismaService],
  exports: [MarketService],
})
export class MarketModule {}
