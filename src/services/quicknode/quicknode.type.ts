interface MultiTokenValue {
  id: string;
  value: string;
}

export enum TokenType {
  ERC20 = "ERC-20",
  ERC721 = "ERC-721",
  ERC1155 = "ERC-1155",
  OTHER = "Other" // Use "Other" to cover any unexpected types
}

export interface TokenInfo {
  type: TokenType; // Enum for token type (ERC-20, ERC-721, or ERC-1155)
  name: string;
  contract: string;
  transfers: number;
  symbol: string;
  decimals: number;
  multiTokenValues?: MultiTokenValue[];
  balance?: string;
}

interface AddressResult {
  page: number;
  totalPages: number;
  itemsOnPage: number;
  address: string;
  balance: string;
  unconfirmedBalance: string;
  unconfirmedTxs: number;
  txs: number;
  txids: string[];
  nonce: string;
  tokens: TokenInfo[];
}


export interface AddressBalanceResponse {
  ID: string | null;
  Jsonrpc: string;
  result: AddressResult;
}

export interface ExchangeRatesResponse {
  jsonrpc: string;
  result: {
    rates: Record<string, number>; // Exchange rates with currency codes as keys and rates as values
    fetched_at: string;
  };
  id: number;
}


