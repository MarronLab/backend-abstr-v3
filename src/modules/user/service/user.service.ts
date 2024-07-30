import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
  UnauthorizedException,
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
import { UpdateProfileRequestDto } from '../dto/update-profile.dto';
import {
  ProfileData,
  UpdateProfileRequest,
} from 'src/services/modulus/modulus.type';
import { Prisma } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class UserService extends BaseService {
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
}
