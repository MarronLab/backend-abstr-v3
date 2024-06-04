import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiTags } from '@nestjs/swagger';
import { TransactionInterceptor } from 'src/common/transaction.interceptor';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('find-safe-detail/:userAddress')
  @UseInterceptors(TransactionInterceptor)
  async getSafeAddress(@Param('userAddress') userAddress: string) {
    return await this.userService.getSafeAddress(userAddress);
  }
}
