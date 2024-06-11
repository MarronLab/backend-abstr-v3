import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags } from '@nestjs/swagger';
import LoginDto from '../dto/auth.dto';
import RegisterDto from '../dto/auth.register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() account: LoginDto) {
    return await this.authService.login(account.email, account.password);
  }

  @Post('register')
  async register(@Body() account: RegisterDto) {
    return await this.authService.register(account);
  }
}
