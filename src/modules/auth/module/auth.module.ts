import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { HttpModule } from '@nestjs/axios';
import { ModulusService } from 'src/services/modulus/modulus.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.maroon.io',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ModulusService],
  exports: [AuthService],
})
export class AuthModule {}
