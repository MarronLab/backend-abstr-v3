import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiTags } from '@nestjs/swagger';
import { TransactionInterceptor } from 'src/common/transaction.interceptor';
import {
  ValidateRequestPipe,
  ValidateResponseInterceptor,
} from '../../../schema/user/user.validation';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('find-safe-detail/:userAddress')
  @UsePipes(ValidateRequestPipe)
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ValidateResponseInterceptor)
  async getSafeAddress(@Param('userAddress') userAddress: string) {
    return await this.userService.getSafeAddress(userAddress);
  }
}
