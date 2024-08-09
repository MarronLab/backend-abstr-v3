import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { UserModule } from '../user/module/user.module';
import { MoralisModule } from 'src/services/moralis/moralis.module';
import { AuthModule } from '../auth/module/auth.module';
import { ModulusModule } from 'src/services/modulus/modulus.module';

@Module({
  imports: [ModulusModule, MoralisModule, AuthModule, UserModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
