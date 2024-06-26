import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

      return data.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
