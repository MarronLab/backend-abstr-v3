import { Injectable } from '@nestjs/common';
import { SafeService } from 'src/services/safe.service';

@Injectable()
export class UserService {
  constructor(private readonly safeService: SafeService) {}

  async getSafeAddress(userAddress: string) {
    try {
      return await this.safeService.getSafeAddress({
        userAddress,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
