import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ip = request.clientIp;
    const action = `${request.method} ${request.url}`;

    return next.handle().pipe(
      tap(async (value) => {
        const data: any = {
          ipAddress: ip,
          action,
          response: JSON.stringify(value),
          success: true,
        };

        if (user) {
          const internalUser = await this.prisma.user.findFirst({
            where: { modulusCustomerID: user.customerID },
          });
          data.userId = internalUser ? internalUser.id : undefined;
        }

        await this.prisma.userActivity.create({
          data,
        });
      }),
      catchError(async (e) => {
        const data: any = {
          ipAddress: ip,
          action,
          response: JSON.stringify(e),
          success: false,
        };

        if (user) {
          const internalUser = await this.prisma.user.findFirst({
            where: { modulusCustomerID: user.customerID },
          });

          data.userId = internalUser ? internalUser.id : undefined;
        }

        await this.prisma.userActivity.create({
          data,
        });
        throw e;
      }),
    );
  }
}
