import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ValidateRequestPipe,
  ValidateResponseInterceptor,
} from '../../../schema/user/user.validation';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { ResponseValidationInterceptor } from 'src/common/response-validator.interceptor';
import { GetProfileResponseDto } from '../dto/get-profile.dto';
import { getProfileResponseSchema } from '../schema/user.schema';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('find-safe-detail/:userAddress')
  @UsePipes(ValidateRequestPipe)
  @UseInterceptors(ValidateResponseInterceptor)
  async getSafeAddress(@Param('userAddress') userAddress: string) {
    return await this.userService.getSafeAddress(userAddress);
  }

  @Get('/profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(getProfileResponseSchema))
  async getProfile() {
    const response = await this.userService.getProfile();

    return new GetProfileResponseDto({
      id: response.customerID,
      firstName: response.firstName,
      middleName: response.middleName,
      lastName: response.lastName,
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
    });
  }
}
