import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { SafeService } from 'src/services/safe.service';
import { CoingeckoService } from 'src/services/coingecko/coingecko.service';
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
    private readonly coingeckoService: CoingeckoService,
  ) {
    super(prisma, req);
  }

  async generateSafeAddress(generateSafeAddressDto: GenerateSafeAddressDto) {
    try {
      return await this.safeService.generateSafeAddress({
        userAddress: generateSafeAddressDto.userAddress,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getProfile() {
    try {
      const userId: string = (this.req.user as ProfileData)?.internalData.id;

      const { data } = await this.modulusService.getProfile();

      console.log({ data });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      const internalUser = await this.getInternalUserProfile(userId);

      console.log({ ...data.data, ...internalUser });

      return { ...data.data, ...internalUser };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getInternalUserProfile(userId: string, userAddress?: string) {
    try {
      return await this.getClient().user.findFirst({
        where: {
          OR: [{ id: userId }, ...(userAddress ? [{ userAddress }] : [])],
        },
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
          userEmail: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateProfile(updateProfileRequestDto: UpdateProfileRequestDto) {
    const userId: string = (this.req.user as ProfileData)?.internalData.id;

    if (!userId) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const internalUser = await this.getClient().user.findUnique({
      where: { id: userId },
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
        where: { id: userId },
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

  async saveFavoriteCoins(coinId: string, watchlist: boolean) {
    try {
      const userId: string = (this.req.user as ProfileData)?.internalData.id;

      const normalizedCoinId = coinId.toLowerCase();

      if (watchlist) {
        await this.getClient().userFavorite.upsert({
          where: {
            userId_coinId: {
              userId,
              coinId: normalizedCoinId,
            },
          },
          update: {},
          create: {
            userId,
            coinId: normalizedCoinId,
          },
        });

        return {
          status: 'Success',
          message: 'Coin added to watchlist.',
          data: null,
        };
      } else {
        const favoriteCoin = await this.getClient().userFavorite.findUnique({
          where: {
            userId_coinId: {
              userId,
              coinId: normalizedCoinId,
            },
          },
        });

        if (!favoriteCoin) {
          return {
            status: 'Success',
            message: 'Coin not found in watchlist.',
            data: null,
          };
        }

        await this.getClient().userFavorite.delete({
          where: {
            userId_coinId: {
              userId,
              coinId: normalizedCoinId,
            },
          },
        });

        return {
          status: 'Success',
          message: 'Coin removed from watchlist.',
          data: null,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to update favorite coin.');
    }
  }

  async getSaveFavoriteCoins() {
    try {
      const userId: string = (this.req.user as ProfileData)?.internalData.id;

      const savedCoins = await this.getClient().userFavorite.findMany({
        where: { userId },
        select: { coinId: true },
      });

      if (!savedCoins.length) {
        return {
          status: 'Success',
          message: 'No favorite coins found.',
          data: [],
        };
      }

      const coinDataPromises = savedCoins.map(async (savedCoin) => {
        const coinData = await this.coingeckoService.getSingleCoinData(
          savedCoin.coinId,
          {},
        );

        return {
          id: coinData.id,
          symbol: coinData.symbol,
          name: coinData.name,
          image: coinData.image.large,
          current_price: coinData.market_data.current_price.usd,
          price_change_percentage_24h:
            coinData.market_data.price_change_percentage_24h,
          price_change_24h: coinData.market_data.price_change_24h,
          market_cap_rank: coinData.market_cap_rank,
          high_24h: coinData.market_data.high_24h.usd,
          low_24h: coinData.market_data.low_24h.usd,
        };
      });

      const coinDataResults = await Promise.all(coinDataPromises);

      return {
        status: 'Success',
        message: 'Favorite coins market data fetched successfully.',
        data: coinDataResults,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
