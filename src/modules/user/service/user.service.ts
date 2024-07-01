import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { SafeService } from 'src/services/safe.service';
import GenerateSafeAddressDto from '../dto/generate-safe-address.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly safeService: SafeService,
    private readonly modulusService: ModulusService,
  ) {}

  async generateSafeAddress(generateSafeAddressDto: GenerateSafeAddressDto) {
    try {
      return await this.safeService.generateSafeAddress({
        userAddress: generateSafeAddressDto.userAddress,
        modulusCustomerID: generateSafeAddressDto.modulusCustomerID,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
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
