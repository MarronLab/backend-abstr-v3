import { LimitOrder, OtcOrder, RfqOrder } from '@0x/protocol-utils';
import { BigNumber } from '@0x/utils';
import { ethers } from 'ethers';
import * as crypto from 'crypto';
import { signTypedDataUtils } from '@0x/utils';

export type Numberish = BigNumber | string | number;

/**
 * Generate a random integer between `min` and `max`, inclusive.
 */
export function getRandomInteger(min: Numberish, max: Numberish): BigNumber {
  const range = new BigNumber(max).minus(min);
  return getRandomPortion(range).plus(min);
}

/**
 * Generate a random integer between `0` and `total`, inclusive.
 */
export function getRandomPortion(total: Numberish): BigNumber {
  return new BigNumber(total)
    .times(getRandomFloat(0, 1))
    .integerValue(BigNumber.ROUND_HALF_UP);
}

/**
 * Generate a random, high-precision decimal between `min` and `max`, inclusive.
 */
export function getRandomFloat(min: Numberish, max: Numberish): BigNumber {
  // Generate a really high precision number between [0, 1]
  const r = new BigNumber(crypto.randomBytes(32).toString('hex'), 16).dividedBy(
    new BigNumber(2).pow(256).minus(1),
  );
  return new BigNumber(max).minus(min).times(r).plus(min);
}

export const getPseudoSign = (order: OtcOrder | LimitOrder | RfqOrder) => {
  const orderTypedData = order.getEIP712TypedData();

  const dataBuff = signTypedDataUtils.generateTypedDataHash(orderTypedData);

  const orderPsudoSigner = ethers.recoverAddress(dataBuff, {
    r: '0x0000000000000000000000000000000000000000000000000000000000222174',
    s: '0x0000000000000000000000000000000000000000000000000000000000222174',
    v: 27,
  });

  const pseudoSignature = {
    r: '0x0000000000000000000000000000000000000000000000000000000000222174',
    s: '0x0000000000000000000000000000000000000000000000000000000000222174',
    v: 27,
    signatureType: 2,
  };

  return { orderPsudoSigner, pseudoSignature };
};

export const EIP712_SAFE_TX_TYPE = {
  // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
  SafeTx: [
    { type: 'address', name: 'to' },
    { type: 'uint256', name: 'value' },
    { type: 'bytes', name: 'data' },
    { type: 'uint8', name: 'operation' },
    { type: 'uint256', name: 'safeTxGas' },
    { type: 'uint256', name: 'baseGas' },
    { type: 'uint256', name: 'gasPrice' },
    { type: 'address', name: 'gasToken' },
    { type: 'address', name: 'refundReceiver' },
    { type: 'uint256', name: 'nonce' },
  ],
};

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
