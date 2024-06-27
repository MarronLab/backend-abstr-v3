import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

@ApiBearerAuth()
@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(getBalancesResponseSchema))
  @Get('/balances')
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

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(walletNetworthResponseSchema),
  )
  @Get('/networth')
  async networth() {
    const response = await this.walletService.getWalletNetWorth();

    return new WalletNetworthResponseDto({
      totalNetworth: response.totalNetworth,
      fiatPercentage: response.fiatPercentage,
      totalFiatAmount: response.totalFiatAmount,
      totalCryptoAmount: response.totalCryptoAmount,
      cryptoPercentage: response.cryptoPercentage,
    });
  }
}
