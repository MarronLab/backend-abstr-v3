import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { SafeService } from 'src/services/safe.service';
import { PrismaService } from 'src/services/prisma.service';
import { UserSettingsService } from '../service/user-settings.service';
import { ModulusModule } from 'src/services/modulus/modulus.module';
import { CoingeckoModule } from 'src/services/coingecko/coingecko.module';

@Module({
  imports: [ModulusModule, CoingeckoModule],
  controllers: [UserController],
  providers: [UserService, SafeService, PrismaService, UserSettingsService],
  exports: [UserService],
})
export class UserModule {}
