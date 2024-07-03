import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
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
  walletPerformanceResponseSchema,
} from './wallet.schema';
import {
  WalletPerformanceDto,
  WalletPerformanceResponseDto,
} from './dto/performance.dto';

@ApiBearerAuth()
@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(getBalancesResponseSchema))
  @Get('/balances')
  @ApiOperation({ summary: 'Fetch wallet balances' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The balances has been successfully fetched.',
    type: [GetBalancesResponseDto],
  })
  async balances() {
    const response = await this.walletService.getBalances();

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
  async performance(@Query() walletPerformanceDto: WalletPerformanceDto) {
    const response =
      await this.walletService.getWalletPerformance(walletPerformanceDto);

    return new WalletPerformanceResponseDto({
      graph: response.graph,
      finalBalance: response.finalBalance,
      balanceChange: response.balanceChange,
      balanceChangePercentage: response.balanceChangePercentage,
    });
  }
}
