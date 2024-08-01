import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { AuthModule } from '../auth/module/auth.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { ModulusModule } from 'src/services/modulus/modulus.module';
import { MoralisModule } from 'src/services/moralis/moralis.module';
import { UserModule } from '../user/module/user.module';

@Module({
  imports: [ModulusModule, AuthModule, MoralisModule, UserModule],
  controllers: [WalletController],
  providers: [WalletService, PrismaService],
})
export class WalletModule {}
