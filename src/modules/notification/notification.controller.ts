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
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseValidationInterceptor } from 'src/common/response-validator.interceptor';
import { NotificationService } from './notification.service';
import { getAllNotificationsResponseSchema } from './notification.schema';
import {
  GetAllNotificationsDto,
  GetAllNotificationsResponseDto,
  NotificationResponseDto,
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
  @ApiOperation({ summary: 'Fetch notifications' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The notifications has been successfully fetched.',
    type: GetAllNotificationsResponseDto,
  })
  async getAllNotifications(
    @Query() getAllNotificationsDto: GetAllNotificationsDto,
  ) {
    const { pageInfo, rows } =
      await this.notificationService.getAllNotifications(
        getAllNotificationsDto,
      );

    const result = rows.map((notification) => {
      return new NotificationResponseDto({
        id: notification.Id,
        cid: notification.CID,
        addedOn: notification.AddedOn,
        messageBody: notification.MessageBody,
        messageTitle: notification.MessageTitle,
      });
    });

    return new GetAllNotificationsResponseDto({ pageInfo, result });
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
  @ApiOperation({ summary: 'Mark notification read' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The notifications has been successfully marked read.',
  })
  async notificationsMarkRead(@Param() notificationId: number) {
    const response =
      await this.notificationService.notificationsMarkRead(notificationId);

    return response;
  }
}
