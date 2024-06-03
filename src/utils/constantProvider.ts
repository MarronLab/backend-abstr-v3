class ConstantProvider {
  static clientId: string = process.env.NEXT_PUBLIC_WEBAUTH_CLIEND_ID as string;
  static projectId: string = process.env
    .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;
  static PLATFORM_PRIV_KEY: string = process.env.PLATFORM_PRIV_KEY as string;
  static NETWORK_CHAIN_ID: number = Number(
    process.env.NEXT_PUBLIC_PROJECT_NETWORK_ID,
  );
  static RPC_PROVIDER: string = process.env.RPC_PROVIDER as string;
  static appName: string = 'Maroon POC';
  static safeModule: string = '0x833704B2687317d88bEFF2f6f0aDD420695c05b6';
  static SAFE_4337_MODULE_ADDRESS =
    '0xb82417Abbc53B123531770285B661E6be594563c';
  static ADD_MODULES_LIB_ADDRESS = '0xAE7F839CE88b8Ff4e7Fc8Ae7edD56879096f44cD';
  static ENTRY_POINT_ADDRESS = '0x7125E4f1628d4fdC5ca698D769A2ee8Db2e350F3';
  static SAFE_SINGLETON_ADDRESS = '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762';
  static SAFE_PROXY_FACTORY_ADDRESS =
    '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67';
}

export default ConstantProvider;
