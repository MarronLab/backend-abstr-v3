import { Module } from '@nestjs/common';
import { OrderModule } from './modules/orderBook/order.module';
import { AuthModule } from './modules/auth/module/auth.module';
import { UserModule } from './modules/user/module/user.module';

@Module({
  imports: [OrderModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
