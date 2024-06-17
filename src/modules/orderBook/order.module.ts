import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/services/prisma.service';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { AuthModule } from '../auth/module/auth.module';
import { HttpConfigService } from 'src/services/http-config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    AuthModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, PrismaService, ModulusService],
})
export class OrderModule {}
