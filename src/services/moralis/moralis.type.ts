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

export type MoralisTransactionData = {
  hash: string;
  nonce: string;
  transaction_index: string;
  from_address_entity: null | string;
  from_address_entity_logo: null | string;
  from_address: string;
  from_address_label: null | string;
  to_address_entity: null | string;
  to_address_entity_logo: null | string;
  to_address: string;
  to_address_label: null | string;
  value: string;
  gas: string;
  gas_price: string;
  input: string;
  receipt_cumulative_gas_used: string;
  receipt_gas_used: string;
  receipt_contract_address: null | string;
  receipt_root: null | string;
  receipt_status: string;
  transaction_fee: string;
  block_timestamp: string;
  block_number: string;
  block_hash: string;
};

export type MoralisTransactions = {
  cursor: string;
  page: number;
  page_size: number;
  result: MoralisTransactionData[];
};
