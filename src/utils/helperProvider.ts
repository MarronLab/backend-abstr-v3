import { BigNumber as BigDecimal } from 'bignumber.js';

class HelperProvider {
  static convertNumToBigInt(
    base: number,
    decimals: number,
    amount: string | number,
  ) {
    const bigDecimalAmount = new BigDecimal(base)
      .pow(decimals)
      .multipliedBy(amount);

    // We use toFixed instead of toString because we do not want exponential notation, e.g. 1e+21
    // bigDecimal amount should never have fractional part, because the input-component is already limiting the
    // decimal places according to the payment-token (e.g. max 6 decimals for USDT)
    // However, just in case, we pass toFixed(decimals=0) to ensure that intString is always without decimals.
    const intString = bigDecimalAmount.toFixed(0, BigDecimal.ROUND_DOWN);

    return BigInt(intString);
  }

  static formatUnixTimestamp(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default HelperProvider;
