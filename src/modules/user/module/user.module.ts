import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { SafeService } from 'src/services/safe.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, SafeService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
