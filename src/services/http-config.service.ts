import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: process.env.MODULUS_BASE_URL,
    };
  }
}

@Injectable()
export class CoingeckoConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: process.env.COINGECKO_BASE_URL,
      headers: { 'X-CG-Pro-API-Key': process.env.COINGECKO_API_KEY },
    };
  }
}
