import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ModulusModule } from 'src/services/modulus/modulus.module';
import { UserModule } from '../user/module/user.module';

@Module({
  imports: [ModulusModule, UserModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
