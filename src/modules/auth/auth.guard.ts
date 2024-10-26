import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { UserService } from '../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly modulusService: ModulusService,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.modulusService.removeBearerToken();
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;

      // try {
      //   this.modulusService.setBearerToken(token);

      //   const payload = await this.modulusService.validateBearerToken();

      //   if ('Message' in payload.data) {
      //     throw new UnauthorizedException();
      //   }

      //   const user = await this.modulusService.getProfile();

      //   if (user.data.status !== 'Success') {
      //     throw new UnauthorizedException();
      //   }

      //   const internalUser = await this.userService.getInternalUserProfile(
      //     user.data.data.firstName,
      //   );

      //   if (!internalUser) {
      //     throw new UnauthorizedException();
      //   }

      //   if (internalUser.autoLogoutDuration) {
      //     const lastLoggedInAt = internalUser.lastLoggedInAt;
      //     const currentTime = new Date();

      //     const durationInMilliseconds =
      //       currentTime.getTime() - lastLoggedInAt.getTime();
      //     const durationInMinutes = Math.floor(
      //       durationInMilliseconds / (1000 * 60),
      //     );

      //     // if (durationInMinutes > internalUser.autoLogoutDuration) {
      //     //   await this.modulusService.logout();
      //     //   throw new UnauthorizedException();
      //     // }
      //   }

      // request['user'] = { ...user.data.data, internalData: internalUser };
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
