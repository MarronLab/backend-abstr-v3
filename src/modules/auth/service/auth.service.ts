import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';

import { AuthenticateUserResponse } from 'src/services/modulus/modulus.type';

@Injectable()
export class AuthService {
  constructor(private readonly modulusService: ModulusService) {}

  async login(
    email: string,
    password: string,
  ): Promise<AuthenticateUserResponse> {
    try {
      const response = await this.modulusService.login(email, password);

      if (!response.data.access_token) {
        throw new UnauthorizedException();
      }

      return response.data;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
