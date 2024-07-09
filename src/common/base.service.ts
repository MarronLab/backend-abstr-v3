import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { PRISMA_TRANSACTION_KEY } from './transaction.interceptor';
import { PrismaTransactionClient } from 'src/types';

export class BaseService {
  constructor(
    private prisma: PrismaClient,
    private request: Request,
  ) {}

  protected getClient(): PrismaClient | PrismaTransactionClient {
    return this.request[PRISMA_TRANSACTION_KEY] ?? this.prisma;
  }
}
