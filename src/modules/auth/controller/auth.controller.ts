import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
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
import { registerResponseSchema } from '../../../schema/auth/auth.schema';
import { AuthValidationPipe } from 'src/schema/auth/auth.validation';
import { ResponseTransformInterceptor } from 'src/schema/auth/auth.transformers';
import { ResponseValidationInterceptor } from '../../../common/response-validator.interceptor';
import AuthResponseDto from '../dto/auth.response.dto';
import RegisterResponseDto from '../dto/auth.registerResponse.dto';
import VerifyAccountDto from '../dto/auth.verify.dto';
import SignupResendEmailDto from '../dto/auth.signup.resend.email.dto';

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
}
