import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ModulusService } from './modulus.service';
import { ModulusHttpService } from '../http-config.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.MODULUS_BASE_URL,
    }),
  ],
  providers: [
    ModulusService,
    {
      provide: ModulusHttpService,
      useExisting: HttpService,
    },
  ],
  exports: [ModulusService, ModulusHttpService],
})
export class ModulusModule {}
