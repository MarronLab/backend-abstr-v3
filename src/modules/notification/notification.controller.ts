import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
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
  async getAllNotifications(
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

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The notification ID to mark read',
    type: 'number',
  })
  @Put('/:id')
  async notificationsMarkRead(@Param() notificationId: number) {
    const response =
      await this.notificationService.notificationsMarkRead(notificationId);

    return response;
  }
}
