import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiTags } from '@nestjs/swagger';
import { ValidateRequestPipe } from '../../../schema/user/user.validation';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('find-safe-detail/:userAddress')
  @UsePipes(ValidateRequestPipe)
  async getSafeAddress(@Param('userAddress') userAddress: string) {
    console.log('Parameter received in controller:', userAddress);
    return await this.userService.getSafeAddress(userAddress);
  }
}
