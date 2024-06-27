import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { SafeService } from 'src/services/safe.service';

@Injectable()
export class UserService {
  constructor(
    private readonly safeService: SafeService,
    private readonly modulusService: ModulusService,
  ) {}

  async getSafeAddress(userAddress: string) {
    try {
      return await this.safeService.getSafeAddress({
        userAddress,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getProfile() {
    try {
      const { data } = await this.modulusService.getProfile();

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
