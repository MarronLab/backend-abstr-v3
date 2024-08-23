export type NetworthResponse = {
  total_networth_usd: string;
  chains: {
    chain: string;
    native_balance: string;
    native_balance_formatted: string;
    native_balance_usd: string;
    token_balance_usd: string;
    networth_usd: string;
  }[];
};

export interface MoralisTransaction {
  hash: string;
  nonce: string;
  value: string;
  block_timestamp: string;
  gas: string;
  gas_price: string;
  receipt_status: string;
  erc20_transfers: ERC20Transfer[];
  native_transfers: NativeTransfer[];
}

export interface ERC20Transfer {
  token_name: string;
  token_symbol: string;
  value: string;
  value_formatted: string;
  direction: string;
}

export interface NativeTransfer {
  token_symbol: string;
  value: string;
  value_formatted: string;
  direction: string;
}

export type MoralisTransactionsResponse = {
  cursor: string;
  page: number;
  page_size: number;
  result: MoralisTransaction[];
};
