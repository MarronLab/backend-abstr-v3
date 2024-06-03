import axios from 'axios';
import { ethers } from 'ethers';
import ConstantProvider from './constantProvider';

export const getGasGoal = async () => {
  const RPC_ENDPOINT = ConstantProvider.RPC_PROVIDER;

  const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

  // get max fees from gas station
  let maxFeePerGas = BigInt(80000000000); // fallback to 80 gwei
  let maxPriorityFeePerGas = BigInt(80000000000); // fallback to 80 gwei
  let gasPrice = 370000000000; // fallback to 370 gwei

  const feeData = await provider.getFeeData();
  if (feeData.gasPrice) {
    gasPrice = Math.round(Number(feeData.gasPrice.toString()) * 1.5);
  }

  try {
    const { data } = await axios.get(
      'https://gasstation-mainnet.matic.network/v2',
    );
    maxFeePerGas = ethers.parseUnits(
      Math.ceil(data.fast.maxFee * 1.2) + '',
      'gwei',
    );
    maxPriorityFeePerGas = ethers.parseUnits(
      Math.ceil(data.fast.maxPriorityFee * 1.2) + '',
      'gwei',
    );
  } catch {
    // ignore
  }

  return {
    maxFeePerGas: maxFeePerGas.toString(),
    maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    gasPrice,
  };
};
