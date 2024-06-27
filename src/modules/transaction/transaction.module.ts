import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from 'src/services/http-config.service';
import { AuthModule } from '../auth/module/auth.module';
import { ModulusService } from 'src/services/modulus/modulus.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    AuthModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, ModulusService],
})
export class TransactionModule {}
