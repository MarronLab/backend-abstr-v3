import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import ConstantProvider from 'src/utils/constantProvider';

@Injectable()
export class EthereumService {
  provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(ConstantProvider.RPC_PROVIDER);
  }

  public async getSigner(): Promise<any> {
    const privateKey =
      '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';
    const wallet = new ethers.Wallet(privateKey, this.provider);
    return wallet;
  }

  public async verifyMessage(
    signerAddress: string,
    message: string,
    signature: string,
  ): Promise<boolean> {
    const verifiedAddress = ethers.verifyMessage(message, signature);
    // Check if the recovered address matches the signer's address
    if (verifiedAddress.toLowerCase() === signerAddress.toLowerCase())
      return true;
    else return false;
  }
}
