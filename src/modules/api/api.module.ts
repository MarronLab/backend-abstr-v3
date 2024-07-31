import { Module } from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { AuthModule } from '../auth/module/auth.module';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { ModulusModule } from 'src/services/modulus/modulus.module';

@Module({
  imports: [ModulusModule, AuthModule],
  controllers: [ApiController],
  providers: [ApiService, ModulusService],
})
export class ApiModule {}
