import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ModulusService } from 'src/services/modulus/modulus.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly modulusService: ModulusService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      this.modulusService.setBearerToken(token);

      const payload = await this.modulusService.validateBearerToken();

      if ('Message' in payload.data) {
        throw new UnauthorizedException();
      }

      const user = await this.modulusService.getProfile();

      if (user.data.status !== 'Success') {
        throw new UnauthorizedException();
      }

      request['user'] = user.data.data;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
