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
  sparkline_in_7d: {
    price: number[];
  };
};

export type PriceChangePercentage24hData = {
  btc: number;
  usd: number;
};

export type CoingeckoMarketData = {
  price: number;
  price_btc: string;
  price_change_percentage_24h: PriceChangePercentage24hData;
  market_cap: string;
  market_cap_btc: string;
  total_volume: string;
  total_volume_btc: string;
  sparkline: string;
};

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
    price_btc: number;
    score: number;
    data: CoingeckoMarketData;
  };
};

export type CoingeckoTrendingDataResponse = {
  coins: CoingeckoTrendingItem[];
  nfts: any[];
  categories: any[];
};

export type CoinGeckoTopGainerLoserItem = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  market_cap_rank: number;
  usd: number;
  usd_24h_vol: number;
  usd_24h_change: number;
};

export type CoinGeckoTopGainerLoserResponse = {
  top_gainers: CoinGeckoTopGainerLoserItem[];
  top_losers: CoinGeckoTopGainerLoserItem[];
};

export type SingleCoinGeckoDataResponse = {
  id: string;
  symbol: string;
  name: string;
  web_slug: string;
  asset_platform_id: string | null;
  platforms: {
    [key: string]: string;
  };
  detail_platforms: {
    [key: string]: {
      decimal_place: number | null;
      contract_address: string;
    };
  };
  block_time_in_minutes: number;
  hashing_algorithm: string;
  categories: string[];
  preview_listing: boolean;
  public_notice: string | null;
  additional_notices: string[];
  description: {
    [key: string]: string;
  };
  links: {
    homepage: string[];
    whitepaper: string;
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: string | null;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  country_origin: string;
  genesis_date: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  watchlist_portfolio_users: number;
  market_cap_rank: number;
  market_data: {
    current_price: {
      [key: string]: number;
    };
    total_value_locked: number | null;
    mcap_to_tvl_ratio: number | null;
    fdv_to_tvl_ratio: number | null;
    roi: number | null;
    ath: {
      [key: string]: number;
    };
    ath_change_percentage: {
      [key: string]: number;
    };
    ath_date: {
      [key: string]: string;
    };
    atl: {
      [key: string]: number;
    };
    atl_change_percentage: {
      [key: string]: number;
    };
    atl_date: {
      [key: string]: string;
    };
    market_cap: {
      [key: string]: number;
    };
    market_cap_rank: number;
    fully_diluted_valuation: {
      [key: string]: number;
    };
    market_cap_fdv_ratio: number;
    total_volume: {
      [key: string]: number;
    };
    high_24h: {
      [key: string]: number;
    };
    low_24h: {
      [key: string]: number;
    };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    price_change_24h_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_1h_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_24h_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_7d_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_14d_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_30d_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_60d_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_200d_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_1y_in_currency: {
      [key: string]: number;
    };
    market_cap_change_24h_in_currency: {
      [key: string]: number;
    };
    market_cap_change_percentage_24h_in_currency: {
      [key: string]: number;
    };
    total_supply: number;
    max_supply: number | null;
    circulating_supply: number;
    last_updated: string;
  };
  status_updates: any[];
  last_updated: string;
  tickers: {
    base: string;
    target: string;
    market: {
      name: string;
      identifier: string;
      has_trading_incentive: boolean;
    };
    last: number;
    volume: number;
    converted_last: {
      btc: number;
      eth: number;
      usd: number;
    };
    converted_volume: {
      btc: number;
      eth: number;
      usd: number;
    };
    trust_score: string;
    bid_ask_spread_percentage: number;
    timestamp: string;
    last_traded_at: string;
    last_fetch_at: string;
    is_anomaly: boolean;
    is_stale: boolean;
    trade_url: string;
    token_info_url: string | null;
    coin_id: string;
    target_coin_id: string;
  }[];
};
