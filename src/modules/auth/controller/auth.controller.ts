import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags } from '@nestjs/swagger';
import LoginDto from '../dto/auth.dto';
import { AuthValidationPipe } from 'src/schema/auth/auth.validation';
import { ResponseTransformInterceptor } from 'src/schema/auth/auth.transformers';

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
}
