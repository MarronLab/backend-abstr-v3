import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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
import { AuthGuard } from '../auth/auth.guard';
import { ResponseValidationInterceptor } from '../../common/response-validator.interceptor';
import { WalletService } from './wallet.service';
import { GetBalancesResponseDto } from './dto/getBalances.dto';
import {
  getBalancesResponseSchema,
  walletNetworthResponseSchema,
  walletPerformanceResponseSchema,
} from './wallet.schema';
import {
  WalletPerformanceDto,
  WalletPerformanceResponseDto,
} from './dto/performance.dto';
import { WalletNetworthResponseDto } from './dto/networth.dto';
import { Request } from 'express';
import { ProfileData } from 'src/services/modulus/modulus.type';
import { UserService } from '../user/service/user.service';

@ApiBearerAuth()
@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(getBalancesResponseSchema))
  @Get('/balances')
  @ApiOperation({ summary: 'Fetch wallet balances' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiQuery({
    name: 'safeAddress',
    required: true,
    description: 'The user safe address',
  })
  @ApiOkResponse({
    description: 'The balances has been successfully fetched.',
    type: [GetBalancesResponseDto],
  })
  async balances(@Query('safeAddress') safeAddress: string) {
    const response =
      await this.walletService.getSafeAddressBalances(safeAddress);

    return response.map((row) => {
      return new GetBalancesResponseDto({
        balance: row.balance,
        currency: row.currency,
        holdDeposits: row.holdDeposits,
        balanceInTrade: row.balanceInTrade,
        priceChangePercent24hr: row.priceChangePercent24hr,
      });
    });
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(walletPerformanceResponseSchema),
  )
  @Get('/performance')
  @ApiOperation({ summary: 'Fetch wallet performance' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The performance has been successfully fetched.',
    type: WalletPerformanceResponseDto,
  })
  async performance(
    @Query() walletPerformanceDto: WalletPerformanceDto,
    @Req() req: Request,
  ) {
    const modulusCustomerID: number = (req.user as ProfileData)?.customerID;

    if (!modulusCustomerID) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const internalUser =
      await this.userService.getInternalUserProfile(modulusCustomerID);
    if (!internalUser) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const response = await this.walletService.getMoralisWalletPerformace(
      internalUser.safeAddress,
      walletPerformanceDto,
    );

    return new WalletPerformanceResponseDto({
      graph: response.graph,
      finalBalance: response.finalBalance,
      balanceChange: response.balanceChange,
      balanceChangePercentage: response.balanceChangePercentage,
    });
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(walletNetworthResponseSchema),
  )
  @Get('/networth')
  @ApiOperation({ summary: 'Fetch wallet networth' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The networth has been successfully fetched.',
    type: WalletNetworthResponseDto,
  })
  async networth(@Req() req: Request) {
    const modulusCustomerID: number = (req.user as ProfileData)?.customerID;

    if (!modulusCustomerID) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const internalUser =
      await this.userService.getInternalUserProfile(modulusCustomerID);
    if (!internalUser) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const response = await this.walletService.getMoralisWalletNetWorth(
      internalUser.safeAddress,
    );

    console.log(response);

    return new WalletNetworthResponseDto({
      totalNetworth: response.totalNetworth,
      fiatPercentage: response.fiatPercentage,
      totalFiatAmount: response.totalFiatAmount,
      totalCryptoAmount: response.totalCryptoAmount,
      cryptoPercentage: response.cryptoPercentage,
    });
  }
}
