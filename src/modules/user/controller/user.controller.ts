import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('find-safe-detail/:userAddress')
  async getSafeAddress(@Param('userAddress') userAddress: string) {
    return await this.userService.getSafeAddress(userAddress);
  }
}
