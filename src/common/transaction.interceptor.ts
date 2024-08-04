import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, from } from 'rxjs';
import { PrismaService } from 'src/services/prisma.service';

export const PRISMA_TRANSACTION_KEY = 'PRISMA_TRANSACTION';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(protected prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();

    return from(
      this.prisma.$transaction(
        async (transactionPrisma) => {
          // attach prisma transaction to the request
          req[PRISMA_TRANSACTION_KEY] = transactionPrisma;

          const observable = this.handleNext(context, next);

          return new Promise((resolve, reject) => {
            observable.subscribe({
              next: async (data) => {
                resolve(data);
              },
              error: async (e) => {
                reject(e);
              },
            });
          });
        },
        {
          timeout: 90000,
        },
      ),
    );
  }

  protected handleNext(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle();
  }
}
