import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { ModulusModule } from 'src/services/modulus/modulus.module';
import { CoingeckoModule } from 'src/services/coingecko/coingecko.module';

@Module({
  imports: [ModulusModule, CoingeckoModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
