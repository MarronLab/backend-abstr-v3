import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import RegisterDto from '../dto/auth.register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async login(email: string, password: string) {
    try {
      const loginResponse = await this.httpService.axiosRef.post(
        '/api/AuthenticateUser/v2',
        {
          email,
          password,
        },
      );

      if (loginResponse.data.status === 'success') {
        const authResponse = await this.httpService.axiosRef.post('/token', {
          grant_type: 'password',
          username: loginResponse.data.tempAuthToken,
          password: '999888',
        });

        if (authResponse.status === 200) return authResponse.data;
        else return null;
      } else return null;
    } catch (error) {
      console.log(error);
    }
  }

  // registration

  async register(registerDto: RegisterDto) {
    try {
      const registerResponse = await this.httpService.axiosRef.post(
        '/api/SignUp',
        registerDto,
      );

      console.log('logging', registerResponse);
      if (registerResponse.data.status === 'success') {
        console.log('logging success', registerResponse.data);
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
