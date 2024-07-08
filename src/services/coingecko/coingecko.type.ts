export type CoinGeckoMarketDataResponse = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number | null;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_change_percentage: number | null;
  atl_date: string | null;
  last_updated: string | null;
  sparkline_in_7d: number[];
};

export type PriceChangePercentage24hData = {
  btc: number;
  usd: number;
};

export type CoingeckoMarketData = {
  price: number;
  price_btc: number;
  price_change_percentage_24h: PriceChangePercentage24hData;
  market_cap: string;
  market_cap_btc: string;
  total_volume: string;
  total_volume_btc: string;
  sparkline: string;
};

// coingecko.type.ts

export type CoingeckoTrendingItem = {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    price_btc: string;
    score: number;
    data: CoingeckoMarketData;
  };
};

export type CoingeckoTrendingDataResponse = {
  coins: CoingeckoTrendingItem[];
  nfts: any[];
  categories: any[];
};
