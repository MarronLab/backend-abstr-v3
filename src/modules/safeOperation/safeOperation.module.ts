import { Module } from '@nestjs/common';
import { SafeOperationService } from './safeoperation.service';
import { SafeService } from 'src/services/safe/safe.service';
import { SafeOperationController } from './safeOperation.controller';
import { PrismaService } from 'src/services/prisma.service';
import { UserSettingsService } from '../user/service/user-settings.service';
import { ModulusModule } from 'src/services/modulus/modulus.module';
import { CoingeckoModule } from 'src/services/coingecko/coingecko.module';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from '../user/service/user.service';

@Module({
  imports: [ModulusModule, CoingeckoModule],
  controllers: [SafeOperationController],
  providers: [
    SafeOperationService,
    AuthGuard,
    UserService,
    SafeService,
    PrismaService,
    UserSettingsService,
  ],
  exports: [],
})
export class SafeOperationModule {}
