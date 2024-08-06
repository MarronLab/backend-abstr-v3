import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  HttpCode,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { ResponseValidationInterceptor } from 'src/common/response-validator.interceptor';
import { GetProfileResponseDto } from '../dto/get-profile.dto';
import {
  generateSafeAddressResponseSchema,
  getProfileResponseSchema,
  getWhiteListedDevicesResponseSchema,
  saveFavoriteCoinsResponseSchema,
  getSaveFavoriteCoinsResponseSchema,
} from '../schema/user.schema';
import GenerateSafeAddressDto, {
  GenerateSafeAddressResponseDto,
} from '../dto/generate-safe-address.dto';
import { UpdateProfileRequestDto } from '../dto/update-profile.dto';
import {
  DeleteWhiteListedDeviceResponseDto,
  DeleteWhiteListedDeviceRequestDto,
} from '../dto/delete-whitelisted-device.dto';
import GetWhiteListedDevicesResponseDto, {
  GetWhiteListedDevicesDataDto,
} from '../dto/user.whiteListedDevice.dto';
import {
  SaveFavoriteCoinsDto,
  SaveFavoriteCoinsResponseDto,
} from '../dto/save-favorite-coins.dto';
import {
  CoinMarketDataDto,
  GetSaveFavoriteCoinsResponseDto,
} from '../dto/get-saveFavoriteCoins.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('safe/generate-address')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(generateSafeAddressResponseSchema),
  )
  @ApiOperation({ summary: 'Generate safe address' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The safe address has been successfully generated',
    type: GenerateSafeAddressResponseDto,
  })
  async generateSafeAddress(
    @Body() generateSafeAddressDto: GenerateSafeAddressDto,
  ) {
    const response = await this.userService.generateSafeAddress(
      generateSafeAddressDto,
    );

    return new GenerateSafeAddressResponseDto({
      initCode: response.initCode,
      safeAddress: response.safeAddress,
      isSafeDeployed: response.isSafeDeployed,
    });
  }

  @Get('/profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(getProfileResponseSchema))
  @ApiOperation({ summary: 'Fetch user profile' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiQuery({
    name: 'userAddress',
    required: true,
    description: 'The user address',
  })
  @ApiOkResponse({
    description: 'The user profile has been successfully fetched.',
    type: GetProfileResponseDto,
  })
  async getProfile(@Query('userAddress') userAddress: string) {
    const response = await this.userService.getProfile(userAddress);

    return new GetProfileResponseDto({
      id: response.customerID,
      firstName: response.firstName ?? '',
      middleName: response.middleName ?? '',
      lastName: response.lastName ?? '',
      loginName: response.loginName,
      email: response.email,
      country: response.country,
      mobileNumber: response.mobileNumber,
      corporateName: response.corporateName,
      kycType: response.kycType,
      joinedOn: response.joinedOn,
      discounts: {
        feeGroups: response.discounts.fee_groups,
        tokenDiscount: response.discounts.token_discount,
        totalDiscount: response.discounts.total_discount,
        volumeDiscount: response.discounts.volume_discount,
      },
      kycStatus: response.kycStatus,
      customFields: response.customFields,
      is2FAEnabled: response.is2FAEnabled,
      currentStatus: response.currentStatus,
      isUserBlocked: response.isUserBlocked,
      kycApprovedBy: response.kycApprovedBy,
      kycRequestInfo: response.kycRequestInfo,
      kycRejectReason: response.kycRejectReason,
      isMobileVerified: response.isMobileVerified,
      kycApprovedLevel: response.kycApprovedLevel,
      priceChangeAlert: response.priceChangeAlert,
      priceChangePercentage: response.priceChangePercentage,
      language: response?.language ?? '',
      currency: response?.currency ?? '',
      timezone: response?.timezone ?? '',
      username: response?.username ?? '',
      safeAddress: response?.safeAddress ?? '',
      userAddress: response?.userAddress ?? '',
      emailNewsletter: response?.emailNewsletter ?? false,
      emailTradeUpdates: response?.emailTradeUpdates ?? false,
      emailAnnouncements: response?.emailAnnouncements ?? false,
      publicID: response?.publicID ?? '',
      autoLogoutDuration: response.autoLogoutDuration ?? null,
      lastLoggedInAt: response.lastLoggedInAt ?? null,
    });
  }

  @Put('/profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The user profile has been successfully updated',
  })
  async updateProfile(
    @Body() updateProfileRequestDto: UpdateProfileRequestDto,
  ) {
    const response = await this.userService.updateProfile(
      updateProfileRequestDto,
    );

    return { data: response };
  }

  @Get('list-whitelisted-devices')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(getWhiteListedDevicesResponseSchema),
  )
  @ApiOperation({ summary: 'Whitelisted Devices' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'Can be used get all whitelisted Devices',
    type: GetWhiteListedDevicesResponseDto,
  })
  async getWhitelistedDevice() {
    const response = await this.userService.getWhitelistedDevices();

    const deviceData = response.data.map(
      (device: any) => new GetWhiteListedDevicesDataDto(device),
    );
    return new GetWhiteListedDevicesResponseDto({
      status: response.status,
      message: response.message,
      data: deviceData,
    });
  }

  @Post('delete-whitelisted-device')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Delete whitelisted device' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The device has been successfully deleted',
    type: DeleteWhiteListedDeviceResponseDto,
  })
  async deleteWhitelistedDevice(
    @Body() param: DeleteWhiteListedDeviceRequestDto,
  ) {
    await this.userService.deleteWhiteListedDevices(param);
  }

  @Post('customer_favourite_coins')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(saveFavoriteCoinsResponseSchema),
  )
  @ApiOperation({ summary: 'Add user favorite coins' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The user has successfully saved favorite coins.',
    type: SaveFavoriteCoinsResponseDto,
  })
  async saveFavoriteCoins(@Body() saveFavoriteCoinsDto: SaveFavoriteCoinsDto) {
    const response = await this.userService.saveFavoriteCoins(
      saveFavoriteCoinsDto.data,
    );

    return new SaveFavoriteCoinsResponseDto({
      status: response.status,
      message: response.message,
      data: response.data,
    });
  }

  @Get('customer_favourite_coins')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(getSaveFavoriteCoinsResponseSchema),
  )
  @ApiOperation({ summary: 'Get user favorite coins market data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description:
      'The user favorite coins market data has been successfully fetched.',
    type: GetSaveFavoriteCoinsResponseDto,
  })
  async getSaveFavoriteCoins() {
    const response = await this.userService.getSaveFavoriteCoins();

    return new GetSaveFavoriteCoinsResponseDto({
      status: response.status,
      message: response.message,
      data: response.data.map(
        (coin) =>
          new CoinMarketDataDto({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            image: coin.image,
            current_price: coin.current_price,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            price_change_24h: coin.price_change_24h,
            market_cap_rank: coin.market_cap_rank,
            high_24h: coin.high_24h,
            low_24h: coin.low_24h,
          }),
      ),
    });
  }
}
