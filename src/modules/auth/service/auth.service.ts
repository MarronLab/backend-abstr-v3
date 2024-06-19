import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import RegisterDto from '../dto/auth.register.dto';

import AuthResponseDto from '../dto/auth.response.dto';
import ErrorResponseDto from '../dto/error.esponse.dto';
@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async login(
    email: string,
    password: string,
  ): Promise<AuthResponseDto | ErrorResponseDto> {
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
          password,
        });

        if (authResponse.status === 200) {
          return {
            access_token: authResponse.data.access_token,
            token_type: authResponse.data.token_type,
            success: true,
          };
        } else {
          throw new HttpException(
            {
              success: false,
              message: 'Failed to retrieve token',
              details: `Status code: ${authResponse.status}`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          {
            success: false,
            message: loginResponse.data.message || 'Login failed',
            details: loginResponse.data.data || 'Unknown error',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.response?.data?.Message,
          details: error.message,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
