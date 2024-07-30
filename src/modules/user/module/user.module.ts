import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { SafeService } from 'src/services/safe.service';
import { PrismaService } from 'src/services/prisma.service';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from 'src/services/http-config.service';
import { AuthModule } from 'src/modules/auth/module/auth.module';
import { UserSettingsService } from '../service/user-settings.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    SafeService,
    PrismaService,
    ModulusService,
    UserSettingsService,
  ],
  exports: [UserService],
})
export class UserModule {}
