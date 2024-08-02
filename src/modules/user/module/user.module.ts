import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { SafeService } from 'src/services/safe.service';
import { PrismaService } from 'src/services/prisma.service';
import { AuthModule } from 'src/modules/auth/module/auth.module';
import { UserSettingsService } from '../service/user-settings.service';
import { ModulusModule } from 'src/services/modulus/modulus.module';

@Module({
  imports: [ModulusModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, SafeService, PrismaService, UserSettingsService],
  exports: [UserService],
})
export class UserModule {}
