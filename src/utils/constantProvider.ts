class ConstantProvider {
  static clientId: string = process.env.NEXT_PUBLIC_WEBAUTH_CLIEND_ID as string;
  static projectId: string = process.env
    .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;
  static PLATFORM_PRIV_KEY: string = process.env.PLATFORM_PRIV_KEY as string;
  static NETWORK_CHAIN_ID: number = 8453;
  static RPC_PROVIDER: string = process.env.RPC_PROVIDER as string;
  static appName: string = 'Maroon POC';
  static SAFE_4337_MODULE_ADDRESS =
    '0xF695D93017eF401cb062db4fAc072C6e6978587a';
  static ADD_MODULES_LIB_ADDRESS = '0xc59e3dF13ab7B61fbd07ae5Ce27b375F1d4a7308';
  static ENTRY_POINT_ADDRESS = '0x948E5b1dBe89127DF0339ca32Ce834904Cbd4C16';
  static SAFE_SINGLETON_ADDRESS = '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762';
  static SAFE_PROXY_FACTORY_ADDRESS =
    '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67';
}

export default ConstantProvider;
