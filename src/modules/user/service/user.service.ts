import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
  // UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { SafeService } from 'src/services/safe.service';
import GenerateSafeAddressDto from '../dto/generate-safe-address.dto';
import { BaseService } from 'src/common/base.service';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/services/prisma.service';
import { Request } from 'express';
import { CoingeckoService } from 'src/services/coingecko/coingecko.service';

@Injectable({ scope: Scope.REQUEST })
export class UserService extends BaseService {
  private readonly singleCoinDataparams = {
    localization: false,
    community_data: false,
    developer_data: false,
    sparkline: true,
  };

  constructor(
    prisma: PrismaService,
    @Inject(REQUEST) req: Request,
    private readonly safeService: SafeService,
    // @Inject('ModulusHttpService')
    private readonly modulusService: ModulusService,
    // @Inject('CoingeckoHttpService')
    private readonly coingeckoService: CoingeckoService,
  ) {
    super(prisma, req);
    console.log('user services');
  }

  async generateSafeAddress(generateSafeAddressDto: GenerateSafeAddressDto) {
    try {
      return await this.safeService.generateSafeAddress({
        userAddress: generateSafeAddressDto.userAddress,
        modulusCustomerID: generateSafeAddressDto.modulusCustomerID,
        modulusCustomerEmail: generateSafeAddressDto.modulusCustomerEmail,
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

      const internalUser = await this.getClient().user.findUnique({
        where: { modulusCustomerID: data.data.customerID },
        select: {
          id: true,
          language: true,
          currency: true,
          timezone: true,
          username: true,
          safeAddress: true,
          userAddress: true,
          emailNewsletter: true,
          emailTradeUpdates: true,
          emailAnnouncements: true,
          publicID: true,
        },
      });

      // if (!internalUser) {
      //   throw new UnauthorizedException('');
      // }

      return { ...data.data, ...internalUser };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getWhitelistedDevices() {
    try {
      const { data } = await this.modulusService.getwhitelistedDevices();

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteWhiteListedDevices(param: { id: number }) {
    try {
      const data = await this.modulusService.deleteWhitelistedDevices(param);

      if (data.data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async saveFavoriteCoins(params: string[]) {
    try {
      const response = await this.modulusService.saveFavoriteCoins({
        data: params,
      });

      if (response.data.status === 'Error') {
        throw new UnprocessableEntityException(response.data.message);
      }

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSaveFavoriteCoins() {
    console.log('Calling getSaveFavoriteCoins');
    try {
      const { data } = await this.modulusService.getSaveFavoriteCoins();

      const response = await this.coingeckoService.getSingleCoinData(
        'solana',
        this.singleCoinDataparams,
      );

      // Logging the response from Coingecko service
      console.log('Single coin data (Solana):', response);
      console.log('single', response);
      return data.data;
    } catch (error) {
      console.log('services', error);
      throw Error(error);
    }
  }
}
