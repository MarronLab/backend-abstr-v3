import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseValidationInterceptor } from 'src/common/response-validator.interceptor';
import { NotificationService } from './notification.service';
import { getAllNotificationsResponseSchema } from './notification.schema';
import {
  GetAllNotificationsDto,
  GetAllNotificationsResponseDto,
} from './dto/notification.dto';

@ApiBearerAuth()
@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(getAllNotificationsResponseSchema),
  )
  @Get('/')
  async getAllTransactions(
    @Query() getAllNotificationsDto: GetAllNotificationsDto,
  ) {
    const { pageInfo, rows } =
      await this.notificationService.getAllNotifications(
        getAllNotificationsDto,
      );

    const result = rows.map((notification) => {
      return new GetAllNotificationsResponseDto({
        id: notification.Id,
        cid: notification.CID,
        addedOn: notification.AddedOn,
        messageBody: notification.MessageBody,
        messageTitle: notification.MessageTitle,
      });
    });

    return { pageInfo, result };
  }
}
