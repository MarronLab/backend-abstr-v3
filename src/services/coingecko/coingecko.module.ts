import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CoingeckoService } from './coingecko.service';
import { CoingeckoHttpService } from 'src/services/http-config.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.COINGECKO_BASE_URL,
    }),
  ],
  providers: [
    CoingeckoService,
    { provide: CoingeckoHttpService, useExisting: HttpService },
  ],
  exports: [CoingeckoService, CoingeckoHttpService],
})
export class CoingeckoModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    this.httpService.axiosRef.defaults.headers.common['X-CG-Pro-API-Key'] =
      process.env.COINGECKO_API_KEY;
  }
}
