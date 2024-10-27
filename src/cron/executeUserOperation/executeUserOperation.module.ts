import { Module } from '@nestjs/common';
import { ExecuteUserOperationService } from './executeUserOperation.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  imports: [],
  providers: [ExecuteUserOperationService, PrismaService],
})
export class ExecuteUserOperationModule {}
