// transaction.interceptor.ts

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
// import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

export const PRISMA_TRANSACTION_KEY = 'PRISMA_TRANSACTION';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    // get request object
    const req = context.switchToHttp().getRequest<Request>();

    // start transaction
    return this.prisma.$transaction(async (transactionPrisma) => {
      // attach prisma transaction to the request
      req[PRISMA_TRANSACTION_KEY] = transactionPrisma;

      return next
        .handle()
        .pipe(
          concatMap(async (data) => {
            return data;
          }),
          catchError(async (e) => {
            throw e;
          }),
          finalize(async () => {
            // Clean up if necessary
          }),
        )
        .toPromise(); // Convert observable to promise to ensure it works with prisma.$transaction
    });
  }
}
