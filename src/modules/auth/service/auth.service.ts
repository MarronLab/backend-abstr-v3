<<<<<<< HEAD
import { HttpService } from '@nestjs/axios';
<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
import RegisterDto from '../dto/auth.register.dto';
=======
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
>>>>>>> 8ae80350913dd1dd91d4828f465af50d27e4c003
=======
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';

import { AuthenticateUserResponse } from 'src/services/modulus/modulus.type';
>>>>>>> cd3fc5f27879af17c1955bd375354da42eae07ba

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

  // registration

  async register(registerDto: RegisterDto) {
    try {
      const registerResponse = await this.httpService.axiosRef.post(
        '/api/SignUp',
        registerDto,
      );

      if (registerResponse.data.status === 'success') {
        return registerResponse.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
