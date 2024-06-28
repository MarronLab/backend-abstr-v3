import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { ListApiKeysDto } from './dto/list-api-keys.dto';
import { GenerateApiKeyDto } from './dto/generate-api-key.dto';
import { DeleteApiKeyDto } from './dto/delete-api-key.dto';

@Injectable()
export class ApiService {
  constructor(private readonly modulusService: ModulusService) {}

  async listApiKeys(listApiKeysDto: ListApiKeysDto) {
    try {
      const { data } = await this.modulusService.listApiKeys({
        keyType: listApiKeysDto.keyType,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async generateApiKey(generateApiKeyDto: GenerateApiKeyDto) {
    try {
      const { data } = await this.modulusService.generateApiKey({
        keyType: generateApiKeyDto.keyType,
        IpAddresses: generateApiKeyDto.ipAddresses,
        twoFactorAuthKey: generateApiKeyDto.twoFactorAuthKey,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteApiKey(deleteApiKeyDto: DeleteApiKeyDto) {
    try {
      const { data } = await this.modulusService.deleteApiKey({
        key: deleteApiKeyDto.key,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
