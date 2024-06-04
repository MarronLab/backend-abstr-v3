import { BaseService } from './common/base.service';

export class AppService extends BaseService {
  getHello(): string {
    return 'Hello World!';
  }
}
