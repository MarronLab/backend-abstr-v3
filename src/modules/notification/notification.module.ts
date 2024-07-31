import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { AuthModule } from '../auth/module/auth.module';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { ModulusModule } from 'src/services/modulus/modulus.module';

@Module({
  imports: [ModulusModule, AuthModule],
  controllers: [NotificationController],
  providers: [NotificationService, ModulusService],
})
export class NotificationModule {}
