import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderTransformInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly classType: Type<T>) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) =>
        plainToClass(this.classType, data, {
          excludeExtraneousValues: true,
        }),
      ),
    );
  }
}
