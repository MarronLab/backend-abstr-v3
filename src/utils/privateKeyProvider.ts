import { ethers } from 'ethers';
import ConstantProvider from './constantProvider';

// Set up Ethereum provider
export const ethersProvider = new ethers.JsonRpcProvider(
  ConstantProvider.RPC_PROVIDER,
);

const platformPrivKey = ConstantProvider.PLATFORM_PRIV_KEY;

// Set up signers
export const platformSigner = new ethers.Wallet(
  platformPrivKey,
  ethersProvider,
);
