import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

import { SafeOperationService } from './safeoperation.service';
import { AuthGuard } from '../auth/auth.guard';
import { BuildSafeOperationDto } from './dto/build-safe-operation.dto';
import { BatchUserOperationDto } from './dto/batch-user-operation.dto';
import { SignFillOrderDto } from './dto/sign-fill-order.dto';

@ApiTags('safe operation')
@Controller('safeOperation')
export class SafeOperationController {
  constructor(private readonly safeoperationService: SafeOperationService) {}

  @UseGuards(AuthGuard)
  @Get('safe-address/:userAddress')
  @ApiParam({
    name: 'userAddress',
    required: true,
    description: 'The user wallet address',
    type: 'string',
  })
  @ApiOperation({
    summary: 'This endpoint allows is used to get safe details',
  })
  async getSafeAddress(@Param('userAddress') userAddress: string) {
    return await this.safeoperationService.getSafeAddress(userAddress);
  }

  @UseGuards(AuthGuard)
  @Get('nonce')
  @ApiOperation({
    summary: 'This endpoint generate safe nonce',
  })
  async getNonce() {
    const nonce = await this.safeoperationService.getNonce();
    return {nonce};
  }

  @UseGuards(AuthGuard)
  @Post('create-operation')
  @ApiOperation({
    summary:
      'This endpoint is used to get user operation that is signed by platform',
  })
  async handleBuildSafeOperation(
    @Body() buildSafeOperationDto: BuildSafeOperationDto,
  ) {
    const response = await this.safeoperationService.handleBuildSafeOperation(
      buildSafeOperationDto,
    );

    return response;
  }

  @UseGuards(AuthGuard)
  @Post('store-operations')
  @ApiOperation({
    summary:
      'This endpoint is used to store user operations that will be executed',
  })
  async storeSafeOperations(
    @Body() batchUserOperationDto: BatchUserOperationDto,
  ) {
    return await this.safeoperationService.storeSafeOperations(
      batchUserOperationDto,
    );
  }

  @UseGuards(AuthGuard)
  @Post('sign-fill-order')
  @ApiOperation({
    summary: 'This endpoint is used to sign fill order by platform',
  })
  async signFillOrder(@Body() orderData: SignFillOrderDto) {
    return await this.safeoperationService.signFillOrder(orderData);
  }
}
