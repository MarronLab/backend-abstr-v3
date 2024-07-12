import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';

import { AuthenticateUserResponse } from 'src/services/modulus/modulus.type';
import RegisterDto from '../dto/auth.register.dto';
import VerifyAccountDto from '../dto/auth.verify.dto';
import SignupResendEmailDto from '../dto/auth.signup.resend.email.dto';
import ChangePasswordDto from '../dto/auth.change-password.dto';
import ChangeEmailDto from '../dto/auth.change-email.dto';
import VerifyChangeEmailOtpDto from '../dto/auth.verify-change-email-otp.dto';

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

  async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    try {
      const { data } = await this.modulusService.verifyAccount({
        otp: verifyAccountDto.otp,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async signupResendEmail(signupResendEmailDto: SignupResendEmailDto) {
    try {
      const { data } = await this.modulusService.signupResendEmail({
        email: signupResendEmailDto.email,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    try {
      const { data } = await this.modulusService.changePassword({
        otp: changePasswordDto.otp,
        newPassword: changePasswordDto.newPassword,
        oldPassword: changePasswordDto.oldPassword,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data.data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changeEmail(changeEmailDto: ChangeEmailDto) {
    try {
      const { data } = await this.modulusService.changeEmail({
        NewEmail: changeEmailDto.email,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data.data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async requestChangePasswordOTP() {
    try {
      const { data } = await this.modulusService.requestChangePasswordOTP();

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyChangeEmailOtp(verifyChangeEmailOtpDto: VerifyChangeEmailOtpDto) {
    try {
      const { data } = await this.modulusService.changeEmailVerifyOtp({
        OTP_New: verifyChangeEmailOtpDto.newEmailOtp,
        OTP_Old: verifyChangeEmailOtpDto.oldEmailOtp,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data.data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
