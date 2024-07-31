import { HttpModule, HttpService } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import ConstantProvider from 'src/utils/constantProvider';
import { MoralisHttpService } from '../http-config.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://deep-index.moralis.io/api',
    }),
  ],
  providers: [{ provide: MoralisHttpService, useExisting: HttpService }],
  exports: [MoralisHttpService],
})
export class MoralisApiModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    this.httpService.axiosRef.defaults.headers.common['X-API-Key'] =
      ConstantProvider.MORALIS_API_KEY;
  }
}
