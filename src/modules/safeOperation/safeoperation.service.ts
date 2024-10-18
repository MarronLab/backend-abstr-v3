import { Inject, Injectable } from '@nestjs/common';
import { SafeService } from 'src/services/safe/safe.service';
import { BuildSafeOperationDto } from './dto/build-safe-operation.dto';
import { BatchUserOperationDto } from './dto/batch-user-operation.dto';
import { PrismaService } from 'src/services/prisma.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseService } from 'src/common/base.service';
import { SignFillOrderDto } from './dto/sign-fill-order.dto';
import ConstantProvider from 'src/utils/constantProvider';
import { SignatureType } from '@0x/protocol-utils';

@Injectable()
export class SafeOperationService extends BaseService {
  constructor(
    private readonly safeService: SafeService,
    prisma: PrismaService,
    @Inject(REQUEST) req: Request,
  ) {
    super(prisma, req);
  }

  async getSafeAddress(userAddress: string) {
    return await this.safeService.getSafeAddress({ userAddress });
  }

  async getNonce() {
    return await this.safeService.getNonce();
  }

  async handleBuildSafeOperation(buildSafeOperationDto: BuildSafeOperationDto) {
    return await this.safeService.getUserOperation({
      to: buildSafeOperationDto.to,
      value: buildSafeOperationDto.value,
      data: buildSafeOperationDto.data,
      nonce: buildSafeOperationDto.nonce,
      userAddress: buildSafeOperationDto.userAddress,
      safeAddress: buildSafeOperationDto.safeAddress,
      userSignature: buildSafeOperationDto.userSignature,
      isInitCode: buildSafeOperationDto.isInitCode,
    });
  }

  async storeSafeOperations(batchUserOperationDto: BatchUserOperationDto) {
    return await this.getClient().userOperation.createMany({
      data: batchUserOperationDto.operations,
    });
  }

  async signFillOrder(signFillOrderDto: SignFillOrderDto) {
    const { order } = await this.safeService.createOrder(signFillOrderDto);

    const signature = order.getSignatureWithKey(
      `0x${ConstantProvider.PLATFORM_PRIV_KEY}`,
      SignatureType.EIP712,
    );

    return signature;
  }
}
