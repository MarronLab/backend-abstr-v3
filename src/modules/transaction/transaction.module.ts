import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AuthModule } from '../auth/module/auth.module';
import { ModulusModule } from 'src/services/modulus/modulus.module';

@Module({
  imports: [ModulusModule, AuthModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
