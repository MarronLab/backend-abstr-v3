import { Injectable } from '@nestjs/common';
import { SafeService } from 'src/services/safe.service';

@Injectable()
export class UserService {
  async getSafeAddress(userAddress: string) {
    try {
      const safeService = new SafeService();
      return await safeService.getSafeAddress({
        userAddress,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
