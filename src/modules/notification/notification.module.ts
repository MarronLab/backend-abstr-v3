import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from 'src/services/http-config.service';
import { AuthModule } from '../auth/module/auth.module';
import { ModulusService } from 'src/services/modulus/modulus.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
    AuthModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, ModulusService],
})
export class NotificationModule {}
