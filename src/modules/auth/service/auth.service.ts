import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';

import { AuthenticateUserResponse } from 'src/services/modulus/modulus.type';
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
        firstname: registerDto.firstname,
        middlename: registerDto.middlename,
        lastname: registerDto.lastname,
        email: registerDto.email,
        country: registerDto.country,
        mobile: registerDto.mobile,
        password: registerDto.password,
        referralId: registerDto.referralId ?? null,
        mobileOTP: registerDto.mobileOTP,
      });

      console.log(data);
      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data.data;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
