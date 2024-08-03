import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { ModulusModule } from 'src/services/modulus/modulus.module';
import { UserModule } from '../user/module/user.module';

@Module({
  imports: [ModulusModule, UserModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
