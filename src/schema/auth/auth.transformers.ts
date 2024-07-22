import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import AuthResponseDto from '../../modules/auth/dto/auth.response.dto';
import ErrorResponseDto from 'src/modules/auth/dto/error.esponse.dto';

@Injectable()
export class AuthTransformInterceptor<T> implements NestInterceptor<T, any> {
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

// Response Validation for login
@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      map(async (data) => {
        if (data && data.status !== 'Error') {
          // const responseDto = plainToClass(AuthResponseDto, data);
          // await validateOrReject(responseDto);
          // return responseDto;
        } else {
          // const errorResponse = plainToClass(ErrorResponseDto, data);
          // await validateOrReject(errorResponse);
          // return errorResponse;
        }

        return data;
      }),
    );
  }
}
