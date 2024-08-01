import { type } from 'os';

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
  from_address: string;
  from_address_label: string;
  to_address: string;
  to_address_label: string;
  value: string;
  gas: string;
  gas_price: string;
  input: string;
  receipt_cumulative_gas_used: string;
  receipt_gas_used: string;
  receipt_contract_address: string | null;
  receipt_root: string | null;
  receipt_status: string;
  block_timestamp: string;
  block_number: string;
  block_hash: string;
  transfer_index: number[];
};

export type MoralisTransactions = {
  cursor: string;
  page: number;
  page_size: number;
  result: MoralisTransactionData[];
};
