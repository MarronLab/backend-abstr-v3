import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import {
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
}
