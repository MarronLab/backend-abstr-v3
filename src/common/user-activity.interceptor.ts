import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { PrismaService } from '../services/prisma.service';
import {
  PRISMA_TRANSACTION_KEY,
  TransactionInterceptor,
} from './transaction.interceptor';

@Injectable()
export class UserActivityInterceptor extends TransactionInterceptor {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return await super.intercept(context, next);
  }

  protected handleNext(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ip = request.clientIp;
    const body = { ...request.body };
    const action = `${request.method} ${request.url}`;

    if (body.hasOwnProperty('password')) {
      body['password'] = '********';
    }

    const data: any = {
      ipAddress: ip,
      action,
      body: JSON.stringify(body),
    };

    const prisma = request[PRISMA_TRANSACTION_KEY];

    return next.handle().pipe(
      concatMap(async (value) => {
        data.response = JSON.stringify(value) || {};
        data.success = true;

        if (user) {
          const internalUser = await prisma.user.findFirst({
            where: {
              modulusCustomerEmail: user.internalData.modulusCustomerEmail,
            },
          });
          data.userId = internalUser ? internalUser.id : undefined;
        }

        await prisma.userActivity.create({
          data,
        });

        return value;
      }),
      catchError(async (e) => {
        data.response = JSON.stringify(e);
        data.success = false;

        if (user) {
          const internalUser = await prisma.user.findFirst({
            where: {
              modulusCustomerEmail: user.internalData.modulusCustomerEmail,
            },
          });

          data.userId = internalUser ? internalUser.id : undefined;
        }

        await prisma.userActivity.create({
          data,
        });

        throw e;
      }),
    );
  }
}
