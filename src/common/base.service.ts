import { Request } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { PRISMA_TRANSACTION_KEY } from './transaction.interceptor';
import { DefaultArgs } from '@prisma/client/runtime/library';

export class BaseService {
  constructor(
    private prisma: PrismaClient,
    private request: Request,
  ) {}

  protected getClient():
    | PrismaClient
    | Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      > {
    return this.request[PRISMA_TRANSACTION_KEY] ?? this.prisma;
  }
}
