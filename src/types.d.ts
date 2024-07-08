import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PRISMA_TRANSACTION_KEY } from './common/transaction.interceptor';

export type PrismaTransactionClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

declare module 'express-serve-static-core' {
  interface Request {
    [PRISMA_TRANSACTION_KEY]?: PrismaTransactionClient;
  }
}
