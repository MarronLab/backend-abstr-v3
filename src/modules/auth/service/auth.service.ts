import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
  NotFoundException,
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
import HelperProvider from 'src/utils/helperProvider';
import { EthereumService } from 'src/services/ethereum/ethereum.service';
import LoginDto from '../dto/auth.dto';
import { SafeService } from 'src/services/safe/safe.service';
import { UserService } from 'src/modules/user/service/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable({ scope: Scope.REQUEST })
export class AuthService extends BaseService {
  constructor(
    prisma: PrismaService,
    @Inject(REQUEST) private readonly req: Request,
    private readonly safeService: SafeService,
    private readonly modulusService: ModulusService,
    private readonly ethereumService: EthereumService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super(prisma, req);
  }

  async validateUser(
    signerAddress: string,
    signature: string,
    message: string,
    nonce: string,
  ): Promise<boolean> {
    const isVerified = await this.ethereumService.verifyMessage(
      signerAddress,
      message,
      signature,
    );

    if (isVerified) {
      const currentUnixTimestampInSeconds = Math.floor(Date.now() / 1000);

      if (Number(nonce) > currentUnixTimestampInSeconds) {
        return true;
      } else return false;
    } else return false;
  }
  async updateLastLoggedIn(bearerToken: string) {
    this.modulusService.setBearerToken(`Bearer ${bearerToken}`);

    const profile = await this.modulusService.getProfile();

    if (profile.data.status === 'Success') {
      const internalUser = await this.getClient().user.findUnique({
        where: { modulusCustomerEmail: profile.data.data.email },
      });

      if (internalUser) {
        await this.getClient().user.update({
          where: { userAddress: internalUser.userAddress }, // modulusCustomerEmail: internalUser.modulusCustomerEmail
          data: { lastLoggedInAt: new Date() },
        });
      }
    }
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    try {
      const nonce = loginDto.nonce.trim();
      const signature = loginDto.signature.trim();
      const message = HelperProvider.getSignMessage(nonce);

      const internalUser = await this.getClient().user.findUnique({
        where: { userAddress: loginDto.address },
      });

      if (!internalUser) {
        throw new NotFoundException('User not found');
      }

      const isVerified = await this.validateUser(
        internalUser.userAddress,
        signature,
        message,
        nonce,
      );

      if (!isVerified) {
        throw new UnprocessableEntityException('Invalid signature');
      }

      const payload = {
        sub: internalUser.userAddress,
        username: internalUser.safeAddress,
      };

      // const { data } = await this.modulusService.login(
      //   loginDto.email,
      //   loginDto.password,
      // );

      // if ('status' in data && data.status === 'Error') {
      //   throw new UnauthorizedException();
      // } else if ('status' in data && data.status === 'Success') {
      //   return { token: data.data, user: null };
      // } else {
      //   await this.updateLastLoggedIn(data.access_token);

      //   this.modulusService.setBearerToken(data.access_token);

      //   const payload = await this.modulusService.validateBearerToken();

      //   if ('Message' in payload.data) {
      //     throw new UnauthorizedException();
      //   }

      //   const { data: profile } = await this.modulusService.getProfile();

      //   if (profile.status === 'Error') {
      //     throw new UnprocessableEntityException(profile.data);
      //   }

      //   if (!internalUser) {
      //     throw new UnauthorizedException();
      //   }

      //   await this.updateLastLoggedIn(data.access_token);

      // }
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  // Added registration logic (internalUser) with only address
  async register(registerDto: RegisterDto) {
    try {
      const nonce = registerDto.nonce.trim();
      const signature = registerDto.signature.trim();
      const message = HelperProvider.getSignMessage(nonce);

      const isVerified = await this.validateUser(
        registerDto.walletAddress,
        signature,
        message,
        nonce,
      );

      if (!isVerified) {
        throw new UnprocessableEntityException('Invalid signature');
      }

      // const { data } = await this.modulusService.register({
      //   email: registerDto.email,
      //   password: registerDto.password,
      // });

      // if (data.status === 'Error') {
      //   throw new UnprocessableEntityException(data.data);
      // }

      const internalUser = await this.safeService.generateSafeAddress({
        userAddress: registerDto.walletAddress,
      });

      return { internalUser };
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

      this.modulusService.setBearerToken(data.access_token);

      const payload = await this.modulusService.validateBearerToken();

      if ('Message' in payload.data) {
        throw new UnauthorizedException();
      }

      const { data: profile } = await this.modulusService.getProfile();

      if (profile.status === 'Error') {
        throw new UnprocessableEntityException(profile.data);
      }

      const internalUser = await this.userService.getInternalUserProfile(
        profile.data.firstName,
      );

      if (!internalUser) {
        throw new UnauthorizedException();
      }

      await this.updateLastLoggedIn(data.access_token);

      return { token: data, user: { ...internalUser, ...profile.data } };
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
