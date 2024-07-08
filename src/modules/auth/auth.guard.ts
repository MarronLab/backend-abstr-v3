import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.httpService.axiosRef.post(
        '/api/Validate_BearerToken',
        undefined,
        { headers: { Authorization: token } },
      );

      if (payload.data.status !== 'Success') {
        throw new UnauthorizedException();
      }

      const user = await this.httpService.axiosRef.get('/api/GetProfile', {
        headers: { Authorization: token },
      });

      if (user.data.status !== 'Success') {
        throw new UnauthorizedException();
      }

      request['user'] = user.data.data;

      this.httpService.axiosRef.interceptors.request.use((config) => {
        config.headers['Authorization'] = token;
        return config;
      });

      // this.httpService.axiosRef.defaults.headers.common.Authorization = token;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
