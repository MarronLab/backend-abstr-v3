import { Contract, ethers } from 'ethers';
import ConstantProvider from 'src/utils/constantProvider';
import entryPointABI from 'src/utils/entryPointABI';
import { platformSigner } from 'src/utils/privateKeyProvider';
import { safeProxyFactoryCreationCode } from 'src/utils/safe4337/utils/execution';
import { Safe4337 } from 'src/utils/safe4337/utils/safe';
import { PrismaService } from './prisma.service';
import { BaseService } from 'src/common/base.service';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { customAlphabet } from 'nanoid';
import { UserSettingsService } from 'src/modules/user/service/user-settings.service';

@Injectable({ scope: Scope.REQUEST })
export class SafeService extends BaseService {
  constructor(
    prisma: PrismaService,
    @Inject(REQUEST) req: Request,
    private readonly userSettingsService: UserSettingsService,
  ) {
    super(prisma, req);
  }

  private safeGlobalConfig = {
    safeSingleton: ConstantProvider.SAFE_SINGLETON_ADDRESS,
    entryPoint: ConstantProvider.ENTRY_POINT_ADDRESS,
    erc4337module: ConstantProvider.SAFE_4337_MODULE_ADDRESS,
    proxyFactory: ConstantProvider.SAFE_PROXY_FACTORY_ADDRESS,
    addModulesLib: ConstantProvider.ADD_MODULES_LIB_ADDRESS,
    proxyCreationCode: safeProxyFactoryCreationCode,
    chainId: ConstantProvider.NETWORK_CHAIN_ID,
  };

  async callGetSenderAddress(initCode: string) {
    let contract;
    try {
      contract = new Contract(
        ConstantProvider.ENTRY_POINT_ADDRESS,
        entryPointABI,
        platformSigner,
      );

      await contract.getSenderAddress(initCode);
      return '';
    } catch (e: any) {
      const decodedError = contract!.interface.parseError(e.data);
      console.log(decodedError);
      return decodedError?.args[0];
    }
  }

  async generateSafeAddress({
    userAddress,
    modulusCustomerID,
    modulusCustomerEmail,
  }: {
    userAddress: string;
    modulusCustomerID: number;
    modulusCustomerEmail: string;
  }) {
    const safe = await Safe4337.withSigner(userAddress, this.safeGlobalConfig);

    const initCode = safe.getInitCode();

    let safeAddress: string = await this.callGetSenderAddress(initCode);

    const isSafeDeployed = safeAddress === ethers.ZeroAddress;

    const user = await this.getClient().user.findFirst({
      where: {
        userAddress: {
          mode: 'insensitive',
          equals: userAddress,
        },
      },
    });

    if (user) {
      safeAddress = user.safeAddress;
    } else {
      const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const nanoid = customAlphabet(alphabet, 16);

      const userSettings = this.userSettingsService.getUserSettings();

      await this.getClient().user.create({
        data: {
          userAddress,
          safeAddress,
          modulusCustomerID,
          modulusCustomerEmail,
          publicID: nanoid(),
          timezone: userSettings.timezone,
          currency: userSettings.currency,
          language: userSettings.language,
        },
      });
    }

    return {
      safeAddress,
      isSafeDeployed,
      initCode,
    };
  }
}
