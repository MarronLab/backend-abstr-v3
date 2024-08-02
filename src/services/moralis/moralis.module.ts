import { HttpModule, HttpService } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import ConstantProvider from 'src/utils/constantProvider';
import { MoralisHttpService } from '../http-config.service';
import { MoralisService } from './moralis.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://deep-index.moralis.io/api',
    }),
  ],
  providers: [
    MoralisService,
    { provide: MoralisHttpService, useExisting: HttpService },
  ],
  exports: [MoralisService, MoralisHttpService],
})
export class MoralisModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    this.httpService.axiosRef.defaults.headers.common['X-API-Key'] =
      ConstantProvider.MORALIS_API_KEY;
  }
}
