import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/module/auth.module';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { ModulusModule } from 'src/services/modulus/modulus.module';

@Module({
  imports: [ModulusModule, AuthModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
