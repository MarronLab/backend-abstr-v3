import { Inject, Injectable, Scope } from '@nestjs/common';
import { BaseService } from './common/base.service';
import { PrismaService } from './services/prisma.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class AppService extends BaseService {
  constructor(prisma: PrismaService, @Inject(REQUEST) req: Request) {
    super(prisma, req);
  }

  async getHello(): Promise<string> {
    // TODO: to be remove after testing
    await this.getClient().user.create({
      data: { safeAddress: '0x', userAddress: '0x' },
    });

    return 'Hello World!';
  }
}
