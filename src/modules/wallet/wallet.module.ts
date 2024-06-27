import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/services/prisma.service';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { AuthModule } from '../auth/module/auth.module';
import { HttpConfigService } from 'src/services/http-config.service';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    AuthModule,
  ],
  controllers: [WalletController],
  providers: [WalletService, PrismaService, ModulusService],
})
export class WalletModule {}
