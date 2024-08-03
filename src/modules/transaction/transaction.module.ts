import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ModulusModule } from 'src/services/modulus/modulus.module';
import { UserModule } from '../user/module/user.module';

@Module({
  imports: [ModulusModule, UserModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
