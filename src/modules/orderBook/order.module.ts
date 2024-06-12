import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/services/prisma.service';
import { ModulusService } from 'src/services/modulus/modulus.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.MODULUS_URL,
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, PrismaService, ModulusService],
})
export class OrderModule {}
