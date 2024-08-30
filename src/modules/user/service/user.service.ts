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
        modulusCustomerEmail: generateSafeAddressDto.modulusCustomerEmail,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getProfile() {
    try {
      const modulusCustomerEmail: string = (this.req.user as ProfileData)
        ?.internalData.modulusCustomerEmail;

      const { data } = await this.modulusService.getProfile();

      console.log({ data });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      const internalUser =
        await this.getInternalUserProfile(modulusCustomerEmail);

      console.log({ ...data.data, ...internalUser });

      return { ...data.data, ...internalUser };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getInternalUserProfile(modulusCustomerEmail: string) {
    try {
      return await this.getClient().user.findUnique({
        where: { modulusCustomerEmail },
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
          lastLoggedInAt: true,
          autoLogoutDuration: true,
          modulusCustomerEmail: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateProfile(updateProfileRequestDto: UpdateProfileRequestDto) {
    const modulusCustomerEmail: string = (this.req.user as ProfileData)
      ?.internalData.modulusCustomerEmail;

    if (!modulusCustomerEmail) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const internalUser = await this.getClient().user.findUnique({
      where: { modulusCustomerEmail },
    });

    if (!internalUser) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const modulusProfileData: UpdateProfileRequest = {};
    const internalProfileData: Prisma.UserUpdateInput = {};

    if (updateProfileRequestDto.mobile !== undefined) {
      modulusProfileData.mobile = updateProfileRequestDto.mobile;
    }

    if (updateProfileRequestDto.firstname !== undefined) {
      modulusProfileData.firstname = updateProfileRequestDto.firstname;
    }

    if (updateProfileRequestDto.middlename !== undefined) {
      modulusProfileData.middlename = updateProfileRequestDto.middlename;
    }

    if (updateProfileRequestDto.lastname !== undefined) {
      modulusProfileData.lastname = updateProfileRequestDto.lastname;
    }

    if (updateProfileRequestDto.country !== undefined) {
      modulusProfileData.country = updateProfileRequestDto.country;
    }

    if (updateProfileRequestDto.currency !== undefined) {
      internalProfileData.currency = updateProfileRequestDto.currency;
    }

    if (updateProfileRequestDto.timezone !== undefined) {
      internalProfileData.timezone = updateProfileRequestDto.timezone;
    }

    if (updateProfileRequestDto.language !== undefined) {
      internalProfileData.language = updateProfileRequestDto.language;
    }

    if (updateProfileRequestDto.emailNewsletter !== undefined) {
      internalProfileData.emailNewsletter =
        updateProfileRequestDto.emailNewsletter;
    }

    if (updateProfileRequestDto.emailTradeUpdates !== undefined) {
      internalProfileData.emailTradeUpdates =
        updateProfileRequestDto.emailTradeUpdates;
    }

    if (updateProfileRequestDto.emailAnnouncements !== undefined) {
      internalProfileData.emailAnnouncements =
        updateProfileRequestDto.emailAnnouncements;
    }

    if (updateProfileRequestDto.autoLogoutDuration !== undefined) {
      internalProfileData.autoLogoutDuration =
        updateProfileRequestDto.autoLogoutDuration;
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
        where: { modulusCustomerEmail },
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
