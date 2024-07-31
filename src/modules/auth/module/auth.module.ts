import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { AuthGuard } from '../auth.guard';
import { ModulusModule } from 'src/services/modulus/modulus.module';

@Module({
  imports: [ModulusModule],
  controllers: [AuthController],
  providers: [AuthService, ModulusService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
