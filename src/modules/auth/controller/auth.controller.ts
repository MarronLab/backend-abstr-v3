import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags } from '@nestjs/swagger';
import LoginDto from '../dto/auth.dto';
import RegisterDto from '../dto/auth.register.dto';
import { registerResponseSchema } from '../../../schema/auth/auth.schema';
import { RegisterResponseDto } from '../dto/auth.registerResponse.dto';
import { AuthValidationPipe } from 'src/schema/auth/auth.validation';
import { ResponseTransformInterceptor } from 'src/schema/auth/auth.transformers';
import { ResponseValidationInterceptor } from '../../../common/response-validator.interceptor';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(AuthValidationPipe)
  @UseInterceptors(ResponseTransformInterceptor)
  async login(@Body() account: LoginDto) {
    return await this.authService.login(account.email, account.password);
  }

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(registerResponseSchema))
  async register(@Body() account: RegisterDto) {
    const response = await this.authService.register(account);

    return new RegisterResponseDto({
      firstname: response.firstname,
      middlename: response.middlename,
      lastname: response.lastname,
      email: response.email,
      country: response.country,
      mobile: response.mobile,
      password: response.password,
      referralId: response.referralId,
      mobileOTP: response.mobileOTP,
    });
  }
}
