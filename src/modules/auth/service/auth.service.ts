import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';

import {
  AuthenticateUserResponse,
  RegisterResponse,
} from 'src/services/modulus/modulus.type';
import RegisterDto from '../dto/auth.register.dto';

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

  async register(registerDto: RegisterDto) {
    try {
      const { data } = await this.modulusService.register({
        email: registerDto.email,
        password: registerDto.password,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
