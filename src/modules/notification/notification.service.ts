import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { GetAllNotificationsDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly modulusService: ModulusService) {}
  async getAllNotifications(getAllNotificationsDto: GetAllNotificationsDto) {
    try {
      const { data } = await this.modulusService.getAllNotifications({
        page: getAllNotificationsDto.page,
        count: getAllNotificationsDto.count,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.message);
      }

      return data.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async notificationsMarkRead(notificationId: number) {
    try {
      const { data } =
        await this.modulusService.notificationsMarkRead(notificationId);

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.message);
      }

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async notificationsMarkDelete(notificationId: number) {
    try {
      const { data } =
        await this.modulusService.notificationsMarkDelete(notificationId);

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.message);
      }

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
