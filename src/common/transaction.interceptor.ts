import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import {
  Observable,
  catchError,
  concatMap,
  from,
  lastValueFrom,
  throwError,
} from 'rxjs';
import { PrismaService } from 'src/services/prisma.service';

export const PRISMA_TRANSACTION_KEY = 'PRISMA_TRANSACTION';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();

    return from(
      this.prisma.$transaction(async (transactionPrisma) => {
        // attach prisma transaction to the request
        req[PRISMA_TRANSACTION_KEY] = transactionPrisma;

        return lastValueFrom(
          next.handle().pipe(
            concatMap(async (data) => {
              return data;
            }),
            catchError(async (e) => {
              return throwError(() => new Error(e));
            }),
          ),
        );
      }),
    );
  }
}
