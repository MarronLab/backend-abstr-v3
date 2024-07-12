import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import LoginDto from '../dto/auth.dto';
import RegisterDto from '../dto/auth.register.dto';
import {
  getGoogleAuthenticatorEnableResponseSchema,
  registerResponseSchema,
} from '../../../schema/auth/auth.schema';
import { AuthValidationPipe } from 'src/schema/auth/auth.validation';
import { ResponseTransformInterceptor } from 'src/schema/auth/auth.transformers';
import { ResponseValidationInterceptor } from '../../../common/response-validator.interceptor';
import AuthResponseDto from '../dto/auth.response.dto';
import RegisterResponseDto from '../dto/auth.registerResponse.dto';
import VerifyAccountDto from '../dto/auth.verify.dto';
import SignupResendEmailDto from '../dto/auth.signup.resend.email.dto';
import DisableGoogleAuthenticatorDto from '../dto/auth.disable-google-authenticator.dto';
import EnableGoogleAuthenticatorDto from '../dto/auth.enable-google-authenticator.dto';
import GetGoogleAuthenticatorEnableResponseDto from '../dto/auth.get-google-authenticator-enable.dto';
import ChangePasswordDto from '../dto/auth.change-password.dto';
import ChangeEmailDto from '../dto/auth.change-email.dto';
import VerifyChangeEmailOtpDto from '../dto/auth.verify-change-email-otp.dto';
import { AuthGuard } from '../auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(AuthValidationPipe)
  @UseInterceptors(ResponseTransformInterceptor)
  @ApiOperation({ summary: 'Login user' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiCreatedResponse({
    description: 'The user has been successfully logged in.',
    type: AuthResponseDto,
  })
  async login(@Body() account: LoginDto) {
    return await this.authService.login(account.email, account.password);
  }

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(registerResponseSchema))
  @ApiOperation({ summary: 'Register user' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
    type: RegisterResponseDto,
  })
  async register(@Body() account: RegisterDto) {
    const response = await this.authService.register(account);

    return new RegisterResponseDto({
      status: response.status,
      message: response.message,
      data: response.data,
    });
  }

  @Post('verify-account')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Verify user account' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The user account has been successfully verified.',
  })
  async verifyAccount(@Body() verifyAccountDto: VerifyAccountDto) {
    return await this.authService.verifyAccount(verifyAccountDto);
  }

  @Post('resend-email')
  @HttpCode(200)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Resend user verification email' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The user verification email has been successfully sent.',
  })
  async resendEmail(@Body() signupResendEmailDto: SignupResendEmailDto) {
    return await this.authService.signupResendEmail(signupResendEmailDto);
  }

  @Get('gauth/status')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Check Google Authenticator status' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The Google Authenticator status has been successfully fetch.',
    type: 'true',
  })
  async checkGoogleAuthenticatorStatus() {
    return await this.authService.checkGoogleAuthenticatorStatus();
  }

  @Get('gauth/enable')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(
      getGoogleAuthenticatorEnableResponseSchema,
    ),
  )
  @ApiOperation({ summary: 'Enable Google Authenticator' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The Google Authenticator enable has been successfully fetch.',
    type: GetGoogleAuthenticatorEnableResponseDto,
  })
  async getGoogleAuthenticatorEnable() {
    const response = await this.authService.getGoogleAuthenticatorEnable();

    return new GetGoogleAuthenticatorEnableResponseDto({
      qRCode: response.qR_Code,
      pairingCode: response.pairingCode,
    });
  }

  @Post('gauth/enable')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Enable Google Authenticator' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The Google Authenticator has been successfully enable.',
    type: EnableGoogleAuthenticatorDto,
  })
  async enableGoogleAuthenticator(
    @Body() enableGoogleAuthenticatorDto: EnableGoogleAuthenticatorDto,
  ) {
    return await this.authService.enableGoogleAuthenticator(
      enableGoogleAuthenticatorDto,
    );
  }

  @Post('gauth/disable')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Disable Google Authenticator' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The Google Authenticator has been successfully disabled.',
    type: DisableGoogleAuthenticatorDto,
  })
  async disableGoogleAuthenticator(
    @Body() disableGoogleAuthenticatorDto: DisableGoogleAuthenticatorDto,
  ) {
    return await this.authService.disableGoogleAuthenticator(
      disableGoogleAuthenticatorDto,
    );
  }

  @Put('change-email')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Change user login email' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The user login email has been successfully requested.',
  })
  async changeEmail(@Body() changeEmailDto: ChangeEmailDto) {
    const response = await this.authService.changeEmail(changeEmailDto);

    return { data: response };
  }

  @Post('verify-change-email-otp')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Verify change email OTP' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The OTP has been successfully verified.',
  })
  async verifyChangeEmailOTP(
    @Body() verifyChangeEmailOtpDto: VerifyChangeEmailOtpDto,
  ) {
    const response = await this.authService.verifyChangeEmailOtp(
      verifyChangeEmailOtpDto,
    );

    return { data: response };
  }

  @Put('change-password')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Change user login password' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The user login password has been successfully changed.',
  })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const response = await this.authService.changePassword(changePasswordDto);
    return { data: response };
  }

  @Get('request-change-password-otp')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Request change user login password OTP' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description:
      'The user request change login password OTP has been successfully sent.',
  })
  async requestChangePasswordOTP() {
    const response = await this.authService.requestChangePasswordOTP();

    return { data: response };
  }
}
