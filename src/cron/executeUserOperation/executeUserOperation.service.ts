import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Contract, ethers } from 'ethers';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/services/prisma.service';
import ConstantProvider from 'src/utils/constantProvider';
import entryPointABI from 'src/utils/entryPointABI';
import HelperProvider from 'src/utils/helperProvider';
import { platformSigner } from 'src/utils/privateKeyProvider';
import { UserOperation } from 'src/utils/safe4337/utils/userOp';

@Injectable()
export class ExecuteUserOperationService {
  private isRunning = false;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  private getGasGoal() {
    return {
      maxFeePerGas: 100000000,
      maxPriorityFeePerGas: 100000000,
      gasPrice: 100000000, // 0.1 gwei
    };
  }

  private async executeUserOperationOnChain() {
    try {
      const dbUserOperations = await this.prismaService.userOperation.findMany({
        where: {
          isExecuted: false,
        },
      });

      const userOps: UserOperation[] = dbUserOperations.map(
        (dbUserOperation) => ({
          sender: dbUserOperation.sender,
          nonce: dbUserOperation.nonce,
          initCode: dbUserOperation.initCode,
          callData: dbUserOperation.callData,
          callGasLimit: dbUserOperation.callGasLimit,
          verificationGasLimit: dbUserOperation.verificationGasLimit,
          preVerificationGas: dbUserOperation.preVerificationGas,
          maxFeePerGas: dbUserOperation.maxFeePerGas,
          maxPriorityFeePerGas: dbUserOperation.maxPriorityFeePerGas,
          paymasterAndData: dbUserOperation.paymasterAndData,
          signature: dbUserOperation.signature,
        }),
      );

      if (userOps.length > 0) {
        const entryPointContract = new Contract(
          ConstantProvider.ENTRY_POINT_ADDRESS,
          entryPointABI,
          platformSigner,
        );

        const { gasPrice } = this.getGasGoal();

        for (const userOp of userOps) {
          const balanceOf = await entryPointContract.balanceOf(userOp.sender);
          const minAmount = ethers.parseEther('0.008');
          if (BigInt(balanceOf) < minAmount) {
            const executeTxResponse = await entryPointContract.depositTo(
              userOp.sender,
              { signer: platformSigner, value: ethers.parseEther('0.005') },
            );

            await executeTxResponse.wait();
            await HelperProvider.sleep(5000);
          }
        }

        const executeTxResponse = await entryPointContract.handleOps(
          userOps,
          platformSigner.address,
          { gasPrice },
        );

        const executeTxReceipt = await executeTxResponse.wait();

        if (executeTxReceipt.hash) {
          const ids = dbUserOperations.map(
            (dbUserOperation) => dbUserOperation.id,
          );

          await this.prismaService.userOperation.updateMany({
            where: {
              id: {
                in: ids,
              },
            },
            data: {
              isExecuted: true,
              transactionHash: executeTxReceipt.hash,
            },
          });
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async executeUserOperationProcessor(
    processExecuteUserOperationFunction: () => Promise<void>,
  ) {
    let retries = 0;
    const maxRetries = 10;

    while (retries < maxRetries) {
      try {
        await processExecuteUserOperationFunction();
        break;
      } catch (error) {
        this.logger.error(`Error processing user operation: ${error.message}`);
        retries++;
        if (retries < maxRetries) {
          this.logger.log(`Retrying... Attempt ${retries}`);
          await HelperProvider.sleep(3000);
        } else {
          throw new Error(
            `Failed after ${maxRetries} attempts. Error: ${error.message}`,
          );
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    timeZone: 'UTC',
  })
  async executeUserOperations() {
    if (this.isRunning) {
      this.logger.warn(
        'Previous cron job still running. Skipping this execution.',
      );
      return;
    }

    this.isRunning = true;
    this.logger.warn('User operations execution started..');

    try {
      await this.executeUserOperationProcessor(async () => {
        await this.executeUserOperationOnChain();
      });
    } catch (error) {
      this.logger.error(error);
    } finally {
      this.isRunning = false;
      this.logger.warn('User operations execution completed.');
    }
  }
}
