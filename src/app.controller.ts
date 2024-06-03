import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionInterceptor } from './common/transaction.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @UseInterceptors(TransactionInterceptor)
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
