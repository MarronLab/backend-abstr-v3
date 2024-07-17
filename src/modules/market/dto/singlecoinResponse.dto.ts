import { ApiProperty } from '@nestjs/swagger';

class PlatformsDto {
  [key: string]: string;
}

class DetailPlatformsDto {
  @ApiProperty({ nullable: true })
  decimal_place: number | null;

  @ApiProperty()
  contract_address: string;
}

class ReposUrlDto {
  @ApiProperty({ type: [String] })
  github: string[];

  @ApiProperty({ type: [String] })
  bitbucket: string[];
}

class LinksDto {
  @ApiProperty({ type: [String] })
  homepage: string[];

  @ApiProperty()
  whitepaper: string;

  @ApiProperty({ type: [String] })
  blockchain_site: string[];

  @ApiProperty({ type: [String] })
  official_forum_url: string[];

  @ApiProperty({ type: [String] })
  chat_url: string[];

  @ApiProperty({ type: [String] })
  announcement_url: string[];

  @ApiProperty()
  twitter_screen_name: string;

  @ApiProperty()
  facebook_username: string;

  @ApiProperty()
  telegram_channel_identifier: string;

  @ApiProperty({ nullable: true })
  bitcointalk_thread_identifier: string | null;

  @ApiProperty()
  subreddit_url: string;

  @ApiProperty({ type: ReposUrlDto })
  repos_url: ReposUrlDto;
}

class ImageDto {
  @ApiProperty()
  thumb: string;

  @ApiProperty()
  small: string;

  @ApiProperty()
  large: string;
}

class MarketDataDto {
  @ApiProperty({ type: Object })
  current_price: { [key: string]: number };

  @ApiProperty({ nullable: true })
  total_value_locked: number | null;

  @ApiProperty({ nullable: true })
  mcap_to_tvl_ratio: number | null;

  @ApiProperty({ nullable: true })
  fdv_to_tvl_ratio: number | null;

  @ApiProperty({ nullable: true })
  roi: number | null;

  @ApiProperty({ type: Object })
  ath: { [key: string]: number };

  @ApiProperty({ type: Object })
  ath_change_percentage: { [key: string]: number };

  @ApiProperty({ type: Object })
  ath_date: { [key: string]: string };

  @ApiProperty({ type: Object })
  atl: { [key: string]: number };

  @ApiProperty({ type: Object })
  atl_change_percentage: { [key: string]: number };

  @ApiProperty({ type: Object })
  atl_date: { [key: string]: string };

  @ApiProperty({ type: Object })
  market_cap: { [key: string]: number };

  @ApiProperty()
  market_cap_rank: number;

  @ApiProperty({ type: Object })
  fully_diluted_valuation: { [key: string]: number };

  @ApiProperty({ nullable: true })
  market_cap_fdv_ratio: number | null;

  @ApiProperty({ type: Object })
  total_volume: { [key: string]: number };

  @ApiProperty({ type: Object })
  high_24h: { [key: string]: number };

  @ApiProperty({ type: Object })
  low_24h: { [key: string]: number };

  @ApiProperty()
  price_change_24h: number;

  @ApiProperty()
  price_change_percentage_24h: number;

  @ApiProperty()
  price_change_percentage_7d: number;

  @ApiProperty()
  price_change_percentage_14d: number;

  @ApiProperty()
  price_change_percentage_30d: number;

  @ApiProperty()
  price_change_percentage_60d: number;

  @ApiProperty()
  price_change_percentage_200d: number;

  @ApiProperty()
  price_change_percentage_1y: number;

  @ApiProperty()
  market_cap_change_24h: number;

  @ApiProperty()
  market_cap_change_percentage_24h: number;

  @ApiProperty({ type: Object })
  price_change_24h_in_currency: { [key: string]: number };

  @ApiProperty({ type: Object })
  price_change_percentage_1h_in_currency: { [key: string]: number };

  @ApiProperty({ type: Object })
  price_change_percentage_24h_in_currency: { [key: string]: number };

  @ApiProperty({ type: Object })
  price_change_percentage_7d_in_currency: { [key: string]: number };

  @ApiProperty({ type: Object })
  price_change_percentage_14d_in_currency: { [key: string]: number };

  @ApiProperty({ type: Object })
  price_change_percentage_30d_in_currency: { [key: string]: number };

  @ApiProperty({ type: Object })
  price_change_percentage_60d_in_currency: { [key: string]: number };

  @ApiProperty({ type: Object })
  price_change_percentage_200d_in_currency: { [key: string]: number };

  @ApiProperty({ type: Object })
  price_change_percentage_1y_in_currency: { [key: string]: number };

  @ApiProperty({ type: Object })
  market_cap_change_24h_in_currency: { [key: string]: number };

  @ApiProperty({ type: Object })
  market_cap_change_percentage_24h_in_currency: { [key: string]: number };

  @ApiProperty()
  total_supply: number;

  @ApiProperty({ nullable: true })
  max_supply: number | null;

  @ApiProperty()
  circulating_supply: number;

  @ApiProperty()
  last_updated: string;
}

class TickerDto {
  @ApiProperty()
  base: string;

  @ApiProperty()
  target: string;

  @ApiProperty()
  market: {
    name: string;
    identifier: string;
    has_trading_incentive: boolean;
  };

  @ApiProperty()
  last: number;

  @ApiProperty()
  volume: number;

  @ApiProperty()
  converted_last: {
    btc: number;
    eth: number;
    usd: number;
  };

  @ApiProperty()
  converted_volume: {
    btc: number;
    eth: number;
    usd: number;
  };

  @ApiProperty()
  trust_score: string;

  @ApiProperty()
  bid_ask_spread_percentage: number;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  last_traded_at: string;

  @ApiProperty()
  last_fetch_at: string;

  @ApiProperty()
  is_anomaly: boolean;

  @ApiProperty()
  is_stale: boolean;

  @ApiProperty()
  trade_url: string;

  @ApiProperty({ nullable: true })
  token_info_url: string | null;

  @ApiProperty()
  coin_id: string;

  @ApiProperty()
  target_coin_id: string;
}

export class SingleCoinGeckoDataResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  web_slug: string;

  @ApiProperty({ nullable: true })
  asset_platform_id: string | null;

  @ApiProperty({ type: PlatformsDto })
  platforms: PlatformsDto;

  @ApiProperty({ type: DetailPlatformsDto })
  detail_platforms: { [key: string]: DetailPlatformsDto };

  @ApiProperty()
  block_time_in_minutes: number;

  @ApiProperty()
  hashing_algorithm: string;

  @ApiProperty({ type: [String] })
  categories: string[];

  @ApiProperty()
  preview_listing: boolean;

  @ApiProperty({ nullable: true })
  public_notice: string | null;

  @ApiProperty({ type: [String] })
  additional_notices: string[];

  @ApiProperty({ type: Object })
  description: { [key: string]: string };

  @ApiProperty({ type: LinksDto })
  links: LinksDto;

  @ApiProperty({ type: ImageDto })
  image: ImageDto;

  @ApiProperty()
  country_origin: string;

  @ApiProperty()
  genesis_date: string;

  @ApiProperty()
  sentiment_votes_up_percentage: number;

  @ApiProperty()
  sentiment_votes_down_percentage: number;

  @ApiProperty()
  watchlist_portfolio_users: number;

  @ApiProperty()
  market_cap_rank: number;

  @ApiProperty({ type: MarketDataDto })
  market_data: MarketDataDto;

  @ApiProperty({ type: [Object] })
  status_updates: any[];

  @ApiProperty()
  last_updated: string;

  @ApiProperty({ type: [TickerDto] })
  tickers: TickerDto[];
}
