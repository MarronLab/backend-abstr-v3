import { Contract, ethers } from 'ethers';
import ConstantProvider from 'src/utils/constantProvider';
import entryPointABI from 'src/utils/entryPointABI';
import { platformSigner } from 'src/utils/privateKeyProvider';
import { safeProxyFactoryCreationCode } from 'src/utils/safe4337/utils/execution';
import { Safe4337 } from 'src/utils/safe4337/utils/safe';
import { PrismaService } from './prisma.service';

export class SafeService {
  private safeGlobalConfig = {
    safeSingleton: ConstantProvider.SAFE_SINGLETON_ADDRESS,
    entryPoint: ConstantProvider.ENTRY_POINT_ADDRESS,
    erc4337module: ConstantProvider.SAFE_4337_MODULE_ADDRESS,
    proxyFactory: ConstantProvider.SAFE_PROXY_FACTORY_ADDRESS,
    addModulesLib: ConstantProvider.ADD_MODULES_LIB_ADDRESS,
    proxyCreationCode: safeProxyFactoryCreationCode,
    chainId: 137,
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

  async getSafeAddress({ userAddress }: { userAddress: string }) {
    const safe = await Safe4337.withSigner(userAddress, this.safeGlobalConfig);

    const initCode = safe.getInitCode();

    const prismaService = new PrismaService();

    let safeAddress = await this.callGetSenderAddress(initCode);

    const isSafeDeployed = safeAddress === ethers.ZeroAddress;

    const user = await prismaService.user.findFirst({
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
      await prismaService.user.create({
        data: {
          userAddress,
          safeAddress,
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
