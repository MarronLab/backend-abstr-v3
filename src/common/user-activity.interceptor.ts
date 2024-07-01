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
    const user = request.user; // Assuming we have user information in the request (e.g., via a JWT auth guard)
    console.log('user: ', user);
    const action = `${request.method} ${request.url}`;

    return next.handle().pipe(
      tap(async (value) => {
        if (user) {
          // await this.prisma.userActivity.create({
          //   data: {
          //     userId: user.customerID,
          //     action,
          //     response: JSON.stringify(value),
          //     success: true,
          //   },
          // });
        }
      }),
      catchError(async (e) => {
        // if (user) {
        //   await this.prisma.userActivity.create({
        //     data: {
        //       userId: user.customerID,
        //       action,
        //       response: JSON.stringify(e),
        //       success: false,
        //     },
        //   });
        // }

        throw e;
      }),
    );
  }
}
