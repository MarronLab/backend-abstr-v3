import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
  UnauthorizedException,
  // UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { SafeService } from 'src/services/safe.service';
import GenerateSafeAddressDto from '../dto/generate-safe-address.dto';
import { BaseService } from 'src/common/base.service';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/services/prisma.service';
import { Request } from 'express';
import { UpdateProfileRequestDto } from '../dto/update-profile.dto';
import {
  ProfileData,
  UpdateProfileRequest,
} from 'src/services/modulus/modulus.type';
import { Prisma } from '@prisma/client';
import {
  GetSaveFavoriteCoinMarketData,
  GetSaveFavoriteCoinType,
} from 'src/services/coingecko/coingecko.type';

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
    @Inject(REQUEST) private readonly req: Request,
    private readonly safeService: SafeService,
    private readonly modulusService: ModulusService,
  ) {
    super(prisma, req);
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

  async getProfile(userAddress: string) {
    try {
      const { data } = await this.modulusService.getProfile();

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      await this.generateSafeAddress({
        userAddress: userAddress,
        modulusCustomerID: data.data.customerID,
        modulusCustomerEmail: data.data.email,
      });

      const internalUser = await this.getInternalUserProfile(
        data.data.customerID,
      );

      return { ...data.data, ...internalUser };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getInternalUserProfile(modulusCustomerID: number) {
    try {
      return await this.getClient().user.findUnique({
        where: { modulusCustomerID },
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
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateProfile(updateProfileRequestDto: UpdateProfileRequestDto) {
    const modulusCustomerID: number = (this.req.user as ProfileData)
      ?.customerID;

    if (!modulusCustomerID) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const internalUser = await this.getClient().user.findUnique({
      where: { modulusCustomerID: modulusCustomerID },
    });

    if (!internalUser) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const modulusProfileData: UpdateProfileRequest = {};
    const internalProfileData: Prisma.UserUpdateInput = {};

    if (updateProfileRequestDto.mobile) {
      modulusProfileData.mobile = updateProfileRequestDto.mobile;
    } else if (updateProfileRequestDto.firstname) {
      modulusProfileData.firstname = updateProfileRequestDto.firstname;
    } else if (updateProfileRequestDto.middlename) {
      modulusProfileData.middlename = updateProfileRequestDto.middlename;
    } else if (updateProfileRequestDto.lastname) {
      modulusProfileData.lastname = updateProfileRequestDto.lastname;
    } else if (updateProfileRequestDto.country) {
      modulusProfileData.country = updateProfileRequestDto.country;
    } else if (updateProfileRequestDto.currency) {
      internalProfileData.currency = updateProfileRequestDto.currency;
    } else if (updateProfileRequestDto.timezone) {
      internalProfileData.timezone = updateProfileRequestDto.timezone;
    } else if (updateProfileRequestDto.language) {
      internalProfileData.language = updateProfileRequestDto.language;
    } else if (updateProfileRequestDto.emailNewsletter) {
      internalProfileData.emailNewsletter =
        updateProfileRequestDto.emailNewsletter;
    } else if (updateProfileRequestDto.emailTradeUpdates) {
      internalProfileData.emailTradeUpdates =
        updateProfileRequestDto.emailTradeUpdates;
    } else if (updateProfileRequestDto.emailAnnouncements) {
      internalProfileData.emailAnnouncements =
        updateProfileRequestDto.emailAnnouncements;
    }

    try {
      const { data } = await this.modulusService.updateProfile({
        country: modulusProfileData.country,
        lastname: modulusProfileData.lastname,
        middlename: modulusProfileData.middlename,
        firstname: modulusProfileData.firstname,
        mobile: modulusProfileData.mobile,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      await this.getClient().user.update({
        where: { modulusCustomerID: modulusCustomerID },
        data: internalProfileData,
      });

      return data.data;
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
    try {
      const { data: modulusData } =
        await this.modulusService.getSaveFavoriteCoins();

      if (!modulusData.data || modulusData.data.length === 0) {
        return {
          status: 'Success',
          message: 'No favorite coins found.',
          data: [],
        };
      }

      const coinListUrl = `${process.env.COINGECKO_BASE_URL}coins/list`;
      const headers = {
        accept: 'application/json',
        'X-CG-Pro-API-Key': process.env.COINGECKO_API_KEY,
      };

      const coinListResponse = await axios.get<GetSaveFavoriteCoinType[]>(
        coinListUrl,
        {
          headers,
        },
      );
      const coinList = coinListResponse.data;

      const idToCoinMap = coinList.reduce(
        (
          map: Record<string, GetSaveFavoriteCoinType>,
          coin: GetSaveFavoriteCoinType,
        ) => {
          map[coin.id] = coin;
          return map;
        },
        {},
      );

      const coinIds = modulusData.data
        .map((id: string) => {
          const coinId = idToCoinMap[id]?.id;
          if (!coinId) {
          }
          return coinId;
        })
        .filter((coinId: string) => !!coinId)
        .join(',');

      if (!coinIds) {
        return {
          status: 'Success',
          message: 'No valid coin IDs found for the provided IDs.',
          data: [],
        };
      }

      const marketDataUrl = `${process.env.COINGECKO_BASE_URL}coins/markets`;
      const marketDataParams = {
        vs_currency: 'usd',
        ids: coinIds,
      };

      const marketDataResponse = await axios.get<
        GetSaveFavoriteCoinMarketData[]
      >(marketDataUrl, {
        headers,
        params: marketDataParams,
      });

      const validatedData = marketDataResponse.data.filter((coin) => {
        const originalCoin = idToCoinMap[coin.id];
        return originalCoin && originalCoin.name === coin.name;
      });

      return {
        status: 'Success',
        message: 'Favorite coins market data fetched successfully.',
        data: validatedData,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
