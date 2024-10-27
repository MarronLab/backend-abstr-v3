import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { AuthGuard } from '../auth.guard';
import { ModulusModule } from 'src/services/modulus/modulus.module';
import { PrismaService } from 'src/services/prisma.service';
import { UserModule } from 'src/modules/user/module/user.module';
import { EthereumService } from 'src/services/ethereum/ethereum.service';
import { SafeService } from 'src/services/safe/safe.service';
import { UserSettingsService } from 'src/modules/user/service/user-settings.service';
import { jwtConstants } from '../constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ModulusModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    PrismaService,
    EthereumService,
    SafeService,
    UserSettingsService,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
