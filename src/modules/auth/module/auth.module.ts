import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { HttpModule } from '@nestjs/axios';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { AuthGuard } from '../auth.guard';
import { HttpConfigService } from 'src/services/http-config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ModulusService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
