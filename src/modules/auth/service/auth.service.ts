import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import RegisterDto from '../dto/auth.register.dto';
import VerifyAccountDto from '../dto/auth.verify.dto';
import SignupResendEmailDto from '../dto/auth.signup.resend.email.dto';
import DisableGoogleAuthenticatorDto from '../dto/auth.disable-google-authenticator.dto';
import EnableGoogleAuthenticatorDto from '../dto/auth.enable-google-authenticator.dto';
import ChangePasswordDto from '../dto/auth.change-password.dto';
import ChangeEmailDto from '../dto/auth.change-email.dto';
import VerifyChangeEmailOtpDto from '../dto/auth.verify-change-email-otp.dto';
import TokenDto from '../dto/auth.token.dto';
import ResendEmailOtpDto from '../dto/auth.resend-email-otp.dto';
import { ForgotPasswordOtpRequestDto } from '../dto/auth.forgot-password-otp.dto';
import { ForgotPasswordRequestDto } from '../dto/auth.forgot-password.dto';
import { BaseService } from 'src/common/base.service';
import { PrismaService } from 'src/services/prisma.service';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class AuthService extends BaseService {
  constructor(
    prisma: PrismaService,
    @Inject(REQUEST) private readonly req: Request,
    private readonly modulusService: ModulusService,
  ) {
    super(prisma, req);
  }

  async updateLastLoggedIn(bearerToken: string) {
    this.modulusService.setBearerToken(`Bearer ${bearerToken}`);

    const profile = await this.modulusService.getProfile();

    if (profile.data.status === 'Success') {
      const internalUser = await this.getClient().user.findUnique({
        where: { modulusCustomerID: profile.data.data.customerID },
      });

      if (internalUser) {
        await this.getClient().user.update({
          where: { modulusCustomerID: internalUser.modulusCustomerID },
          data: { lastLoggedInAt: new Date() },
        });
      }
    }
  }

  async login(email: string, password: string) {
    try {
      const { data } = await this.modulusService.login(email, password);

      if ('status' in data && data.status === 'Error') {
        throw new UnauthorizedException();
      } else if ('status' in data && data.status === 'Success') {
        return data.data;
      }

      await this.updateLastLoggedIn(data.access_token);

      return data;
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

  async disableGoogleAuthenticator(
    disableGoogleAuthenticatorDto: DisableGoogleAuthenticatorDto,
  ) {
    try {
      const { data } = await this.modulusService.gAuthDisableRequest({
        GAuth_Code: disableGoogleAuthenticatorDto.code,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async enableGoogleAuthenticator(
    enableGoogleAuthenticatorDto: EnableGoogleAuthenticatorDto,
  ) {
    try {
      const { data } = await this.modulusService.gAuthSetEnable({
        GAuth_Code: enableGoogleAuthenticatorDto.code,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getGoogleAuthenticatorEnable() {
    try {
      const { data } = await this.modulusService.gAuthEnableRequest();

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

      return data.data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async checkGoogleAuthenticatorStatus() {
    try {
      const { data } = await this.modulusService.gAuthCheckStatus();

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data.data;
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

  async token(tokenDto: TokenDto) {
    try {
      const response = await this.modulusService.token({
        grant_type: tokenDto.grantType,
        username: tokenDto.username,
        password: tokenDto.password,
      });

      const { data } = response;

      if ('error' in data) {
        throw new UnprocessableEntityException(data.error_description);
      }

      await this.updateLastLoggedIn(data.access_token);

      return data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resendEmailOtp(resendEmailOtpDto: ResendEmailOtpDto) {
    try {
      const { data } = await this.modulusService.resentEmailOTP(
        resendEmailOtpDto.token,
      );

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data.data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async validateBearerToken() {
    try {
      const { data } = await this.modulusService.validateBearerToken();

      if ('Message' in data) {
        throw new UnprocessableEntityException(data.Message);
      }

      return data.data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getWhitelistedDevices() {
    try {
      const { data } = await this.modulusService.getwhitelistedDevices();

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async forgotPasswordOtp(
    forgotPasswordOtpRequestDto: ForgotPasswordOtpRequestDto,
  ) {
    try {
      const { data } = await this.modulusService.forgotPasswordOtp({
        email: forgotPasswordOtpRequestDto.email,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data.data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async forgotPassword(forgotPasswordRequestDto: ForgotPasswordRequestDto) {
    try {
      const { data } = await this.modulusService.forgotPassword({
        email: forgotPasswordRequestDto.email,
        email_otp: forgotPasswordRequestDto.emailOtp,
        new_password: forgotPasswordRequestDto.newPassword,
        email_token: forgotPasswordRequestDto.emailToken,
        sms_token: '',
        sms_otp: '',
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
