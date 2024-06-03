import { Module } from '@nestjs/common';
import { OrderModule } from './modules/orderBook/order.module';
import { AuthModule } from './modules/auth/module/auth.module';
import { UserModule } from './modules/user/module/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [OrderModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
