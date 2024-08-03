import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { AuthGuard } from '../auth.guard';
import { ModulusModule } from 'src/services/modulus/modulus.module';
import { PrismaService } from 'src/services/prisma.service';
import { UserModule } from 'src/modules/user/module/user.module';

@Module({
  imports: [ModulusModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, PrismaService],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
