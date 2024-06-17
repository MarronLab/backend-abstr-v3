import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';

export class AuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const authorization = `Bearer ${token}`;

      const payload = await this.httpService.axiosRef.post(
        '/Validate_BearerToken',
        undefined,
        { headers: { Authorization: authorization } },
      );

      if (payload.status !== 200) {
        throw new UnauthorizedException();
      }

      this.httpService.axiosRef.defaults.headers.common.Authorization =
        authorization;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
