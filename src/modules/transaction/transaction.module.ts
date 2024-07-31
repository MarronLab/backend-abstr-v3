import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AuthModule } from '../auth/module/auth.module';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { ModulusModule } from 'src/services/modulus/modulus.module';

@Module({
  imports: [ModulusModule, AuthModule],
  controllers: [TransactionController],
  providers: [TransactionService, ModulusService],
})
export class TransactionModule {}
