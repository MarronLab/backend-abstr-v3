import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ModulusService } from './modulus.service';
import { HttpConfigService } from '../http-config.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
  ],
  providers: [
    ModulusService,
    {
      provide: 'ModulusHttpService',
      useExisting: HttpService,
    },
  ],
  exports: [ModulusService, 'ModulusHttpService'],
})
export class ModulusModule {}
