import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { SafeService } from 'src/services/safe.service';

@Module({
  imports: [SafeService],
  controllers: [UserController],
  providers: [UserService, SafeService],
  exports: [UserService],
})
export class UserModule {}
