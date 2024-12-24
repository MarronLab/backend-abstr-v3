class ConstantProvider {
  static PLATFORM_PRIV_KEY: string = process.env.PLATFORM_PRIV_KEY as string;
  static NETWORK_CHAIN_ID: number = Number(process.env.NETWORK_CHAIN_ID);
  static RPC_PROVIDER: string = process.env.RPC_PROVIDER as string;
  static MORALIS_API_KEY: string = process.env.MORALIS_API_KEY as string;
  static SAFE_4337_MODULE_ADDRESS = process.env
    .SAFE_4337_MODULE_ADDRESS as string;
  static ADD_MODULES_LIB_ADDRESS = process.env
    .ADD_MODULES_LIB_ADDRESS as string;
  static ENTRY_POINT_ADDRESS = process.env.ENTRY_POINT_ADDRESS as string;
  static SAFE_SINGLETON_ADDRESS = process.env.SAFE_SINGLETON_ADDRESS as string;
  static SAFE_PROXY_FACTORY_ADDRESS = process.env
    .SAFE_PROXY_FACTORY_ADDRESS as string;
}

export default ConstantProvider;
