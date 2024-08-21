class ConstantProvider {
  static PLATFORM_PRIV_KEY: string = process.env.PLATFORM_PRIV_KEY as string;
  static NETWORK_CHAIN_ID: number = Number(process.env.NETWORK_CHAIN_ID);
  static RPC_PROVIDER: string = process.env.RPC_PROVIDER as string;
  static MORALIS_API_KEY: string = process.env.MORALIS_API_KEY as string;
  static SAFE_4337_MODULE_ADDRESS =
    '0xF695D93017eF401cb062db4fAc072C6e6978587a';
  static ADD_MODULES_LIB_ADDRESS = '0xc59e3dF13ab7B61fbd07ae5Ce27b375F1d4a7308';
  static ENTRY_POINT_ADDRESS = '0x948E5b1dBe89127DF0339ca32Ce834904Cbd4C16';
  static SAFE_SINGLETON_ADDRESS = '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762';
  static SAFE_PROXY_FACTORY_ADDRESS =
    '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67';
}

export default ConstantProvider;
