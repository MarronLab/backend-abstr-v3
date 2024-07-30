import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoingeckoService } from './coingecko.service';
import { CoingeckoConfigService } from 'src/services/http-config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: CoingeckoConfigService,
    }),
  ],
  providers: [CoingeckoService],
  exports: [CoingeckoService],
})
export class CoingeckoModule {}
