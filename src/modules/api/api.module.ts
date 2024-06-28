import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { AuthModule } from '../auth/module/auth.module';
import { HttpConfigService } from 'src/services/http-config.service';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    AuthModule,
  ],
  controllers: [ApiController],
  providers: [ApiService, ModulusService],
})
export class ApiModule {}
