import { Module } from '@nestjs/common';
import { OrderModule } from './modules/orderBook/order.module';
import { AuthModule } from './modules/auth/module/auth.module';
import { UserModule } from './modules/user/module/user.module';
import { MarketModule } from './modules/market/module/market.module';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [OrderModule, AuthModule, UserModule, MarketModule, WalletModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
