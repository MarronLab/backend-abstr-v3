import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'src/services/prisma.service';
import { ModulusModule } from 'src/services/modulus/modulus.module';
import { UserModule } from '../user/module/user.module';

@Module({
  imports: [ModulusModule, UserModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class OrderModule {}
