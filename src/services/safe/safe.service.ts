import { Contract, ethers } from 'ethers';
import ConstantProvider from 'src/utils/constantProvider';
import entryPointABI from 'src/utils/entryPointABI';
import { platformSigner } from 'src/utils/privateKeyProvider';
import {
  buildSignatureBytes,
  safeProxyFactoryCreationCode,
} from 'src/utils/safe4337/utils/execution';
import { Safe4337 } from 'src/utils/safe4337/utils/safe';
import { PrismaService } from '../prisma.service';
import { BaseService } from 'src/common/base.service';
import {
  Inject,
  Injectable,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { customAlphabet } from 'nanoid';
import { UserSettingsService } from 'src/modules/user/service/user-settings.service';
import { BuildSafeOperationI } from 'src/utils/interfaces';
import {
  buildSafeUserOpTransaction,
  buildUserOperationFromSafeUserOperation,
  signSafeOp,
} from 'src/utils/safe4337/utils/userOp';
import { LimitOrder, ZERO } from '@0x/protocol-utils';
import { BigNumber, NULL_ADDRESS } from '@0x/utils';

interface CreateOrderI {
  maker: string;
  taker: string;
  exchangeProxyAddress: string;
  makerToken: string;
  takerToken: string;
  makerAssetAmount: string;
  takerAssetAmount: string;
  expiryUnixTimestamp: string;
  salt: number;
  pool: string;
}

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

  async createOrder({
    maker,
    taker,
    exchangeProxyAddress,
    makerToken,
    takerToken,
    makerAssetAmount,
    takerAssetAmount,
    expiryUnixTimestamp,
    salt,
    pool,
  }: CreateOrderI) {
    const { NETWORK_CHAIN_ID } = ConstantProvider;

    const fields = {
      chainId: NETWORK_CHAIN_ID,
      verifyingContract: exchangeProxyAddress,
      maker,
      taker,
      makerToken,
      takerToken,
      makerAmount: makerAssetAmount,
      takerAmount: takerAssetAmount,
      takerTokenFeeAmount: ZERO,
      sender: taker,
      feeRecipient: NULL_ADDRESS,
      expiry: expiryUnixTimestamp,
      pool,
      salt: new BigNumber(salt),
    };

    const order = new LimitOrder({
      ...fields,
      makerAmount: new BigNumber(makerAssetAmount),
      takerAmount: new BigNumber(takerAssetAmount),
      expiry: new BigNumber(expiryUnixTimestamp),
    });

    return {
      fields,
      order,
    };
  }

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

  async getNonce() {
    const randomInt = Math.floor(new Date().getTime() / 1000).toString();

    const entryPointContract = new Contract(
      ConstantProvider.ENTRY_POINT_ADDRESS,
      entryPointABI,
      platformSigner,
    );

    const getNonce = await entryPointContract.getNonce(
      platformSigner.address,
      randomInt,
    );

    return getNonce.toString();
  }

  async getSafeAddress({ userAddress }: { userAddress: string }) {
    const safe = await Safe4337.withSigner(userAddress, this.safeGlobalConfig);
    const initCode = safe.getInitCode();
    const safeAddress = await this.callGetSenderAddress(initCode);
    const isSafeDeployed = safeAddress === ethers.ZeroAddress;

    return {
      safeAddress,
      isSafeDeployed,
      initCode,
    };
  }

  async getUserOperation(config: BuildSafeOperationI) {
    try {
      const res = await this.getSafeAddress({
        userAddress: config.userAddress,
      });
      const sender = config.safeAddress;
      let _initCode = res?.initCode;

      if (
        !config.isInitCode ||
        (config.isInitCode && sender === ethers.ZeroAddress)
      ) {
        _initCode = '0x';
      }

      const safeOp = buildSafeUserOpTransaction(
        sender,
        config.to,
        config.value,
        config.data,
        `${config.nonce}`,
        this.safeGlobalConfig.entryPoint,
        false,
        false,
        {
          initCode: _initCode,
        },
      );

      const owner2Signature = await signSafeOp(
        platformSigner,
        this.safeGlobalConfig.erc4337module,
        safeOp,
        this.safeGlobalConfig.chainId,
      );
      if (config.userSignature && owner2Signature) {
        const signature = buildSignatureBytes([
          config.userSignature,
          owner2Signature,
        ]);

        const userOps = buildUserOperationFromSafeUserOperation({
          safeOp,
          signature,
        });

        return userOps;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async generateSafeAddress({
    userAddress,
    modulusCustomerEmail,
  }: {
    userAddress: string;
    modulusCustomerEmail: string;
  }) {
    const { initCode, safeAddress, isSafeDeployed } = await this.getSafeAddress(
      { userAddress },
    );

    const user = await this.getClient().user.findFirst({
      where: {
        OR: [
          {
            modulusCustomerEmail: {
              mode: 'insensitive',
              equals: modulusCustomerEmail,
            },
            userAddress: {
              mode: 'insensitive',
              equals: userAddress,
            },
          },
        ],
      },
    });

    if (user) {
      throw new UnprocessableEntityException('User already exist');
    }

    if (!safeAddress) {
      throw new UnprocessableEntityException('Safe not generated');
    }

    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nanoid = customAlphabet(alphabet, 16);

    const userSettings = this.userSettingsService.getUserSettings();

    await this.getClient().user.create({
      data: {
        userAddress,
        safeAddress,
        modulusCustomerEmail,
        publicID: nanoid(),
        timezone: userSettings.timezone,
        currency: userSettings.currency,
        language: userSettings.language,
      },
    });

    return {
      safeAddress,
      isSafeDeployed,
      initCode,
    };
  }
}
