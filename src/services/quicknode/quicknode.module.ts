import { HttpModule, HttpService } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import ConstantProvider from 'src/utils/constantProvider';
import { QuicknodeHttpService } from '../http-config.service';
import { QuicknodeService } from './quicknode.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.QUICKNODE_ENDPOINT_URL,
    }),
  ],
  providers: [
    QuicknodeService,
    { provide: QuicknodeHttpService, useExisting: HttpService },
  ],
  exports: [QuicknodeService, QuicknodeHttpService],
})

export class QuicknodeModule { }
