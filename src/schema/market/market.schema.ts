import { JSONSchemaType } from 'ajv';
import {
  TrendingMarketDataResponseDto,
  TopGainerLoserResponseDto,
  TopGainerLoserDataResponseDto,
} from '../../modules/market/dto/market.dto';
import {
  SingleCoinGeckoDataResponse,
  CoinGeckoMarketDataResponse,
} from 'src/services/coingecko/coingecko.type';

export const marketDataSchema: JSONSchemaType<CoinGeckoMarketDataResponse[]> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      symbol: { type: 'string' },
      name: { type: 'string' },
      image: { type: 'string' },
      current_price: { type: 'number' },
      market_cap: { type: ['number', 'null'] as any },
      market_cap_rank: { type: 'number' },
      fully_diluted_valuation: { type: ['number', 'null'] as any },
      total_volume: { type: ['number', 'null'] as any },
      high_24h: { type: ['number', 'null'] as any },
      low_24h: { type: ['number', 'null'] as any },
      price_change_24h: { type: ['number', 'null'] as any },
      price_change_percentage_24h: { type: ['number', 'null'] as any },
      market_cap_change_24h: { type: ['number', 'null'] as any },
      market_cap_change_percentage_24h: { type: ['number', 'null'] as any },
      circulating_supply: { type: ['number', 'null'] as any },
      total_supply: { type: ['number', 'null'] as any },
      max_supply: { type: ['number', 'null'] as any },
      ath: { type: ['number', 'null'] as any },
      ath_change_percentage: { type: ['number', 'null'] as any },
      ath_date: { type: ['string', 'null'] as any },
      atl: { type: ['number', 'null'] as any },
      atl_change_percentage: { type: ['number', 'null'] as any },
      atl_date: { type: ['string', 'null'] as any },
      last_updated: { type: ['string', 'null'] as any },
      sparkline_in_7d: {
        type: 'object',
        properties: {
          price: {
            type: 'array',
            items: { type: 'number' },
          },
        },
        required: ['price'],
      },
      watchlist: { type: 'boolean' },
    },
    required: [
      'id',
      'symbol',
      'name',
      'image',
      'current_price',
      'market_cap',
      'market_cap_rank',
      'total_volume',
      'high_24h',
      'low_24h',
      'price_change_24h',
      'price_change_percentage_24h',
      'market_cap_change_24h',
      'market_cap_change_percentage_24h',
      'circulating_supply',
      'total_supply',
      'max_supply',
      'ath',
      'ath_change_percentage',
      'atl',
      'atl_change_percentage',
      'sparkline_in_7d',
    ],
  },
};

export const priceChangePercentage24hSchema: JSONSchemaType<{
  btc: number;
  usd: number;
}> = {
  type: 'object',
  properties: {
    btc: { type: 'number' },
    usd: { type: 'number' },
  },
  required: ['btc', 'usd'],
};

export const coingeckoMarketDataSchema: JSONSchemaType<{
  price: number;
  price_btc: number;
  price_change_percentage_24h: {
    btc: number;
    usd: number;
  };
  market_cap: number;
  market_cap_btc: number;
  total_volume: number;
  total_volume_btc: number;
  sparkline_in_7d: {
    price: number[];
  };
}> = {
  type: 'object',
  properties: {
    price: { type: 'number' },
    price_btc: { type: 'number' },
    price_change_percentage_24h: priceChangePercentage24hSchema,
    market_cap: { type: 'number' },
    market_cap_btc: { type: 'number' },
    total_volume: { type: 'number' },
    total_volume_btc: { type: 'number' },
    sparkline_in_7d: {
      type: 'object',
      properties: {
        price: {
          type: 'array',
          items: { type: 'number' },
        },
      },
      required: ['price'],
    },
  },
  required: [
    'price',
    'price_btc',
    'price_change_percentage_24h',
    'market_cap',
    'market_cap_btc',
    'total_volume',
    'total_volume_btc',
    'sparkline_in_7d',
  ],
};

export const trendingMarketSchema: JSONSchemaType<
  TrendingMarketDataResponseDto[]
> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      coin_id: { type: 'number' },
      name: { type: 'string' },
      symbol: { type: 'string' },
      market_cap_rank: { type: 'number' },
      thumb: { type: 'string' },
      small: { type: 'string' },
      large: { type: 'string' },
      price_btc: { type: 'number' },
      score: { type: 'number' },
      data: coingeckoMarketDataSchema,
    },
    required: [
      'id',
      'coin_id',
      'name',
      'symbol',
      'market_cap_rank',
      'thumb',
      'small',
      'large',
      'price_btc',
      'score',
      'data',
    ],
  },
};

export const topGainerLoserItemSchema: JSONSchemaType<TopGainerLoserResponseDto> =
  {
    type: 'object',
    properties: {
      id: { type: 'string' },
      symbol: { type: 'string' },
      name: { type: 'string' },
      image: { type: 'string' },
      market_cap_rank: { type: 'number' },
      usd: { type: 'number' },
      usd_24h_vol: { type: 'number' },
      usd_24h_change: { type: 'number' },
    },
    required: [
      'id',
      'symbol',
      'name',
      'image',
      'market_cap_rank',
      'usd',
      'usd_24h_vol',
      'usd_24h_change',
    ],
    additionalProperties: false,
  };

export const topGainerLoserDataSchema: JSONSchemaType<TopGainerLoserDataResponseDto> =
  {
    type: 'object',
    properties: {
      top_gainers: {
        type: 'array',
        items: topGainerLoserItemSchema,
      },
      top_losers: {
        type: 'array',
        items: topGainerLoserItemSchema,
      },
    },
    required: ['top_gainers', 'top_losers'],
  };

export const SingleCoinGeckoDataResponseSchema: JSONSchemaType<SingleCoinGeckoDataResponse> =
  {
    type: 'object',
    properties: {
      id: { type: 'string' },
      symbol: { type: 'string' },
      name: { type: 'string' },
      web_slug: { type: 'string' },
      asset_platform_id: { type: ['string', 'null'] as any },
      platforms: {
        type: 'object',
        additionalProperties: { type: 'string' },
        required: [],
      },
      detail_platforms: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            decimal_place: { type: ['number', 'null'] as any },
            contract_address: { type: 'string' },
          },
          required: ['decimal_place', 'contract_address'],
          additionalProperties: false,
        },
        required: [],
      },
      block_time_in_minutes: { type: 'number' },
      hashing_algorithm: { type: ['string', 'null'] as any },
      categories: { type: 'array', items: { type: 'string' } },
      preview_listing: { type: 'boolean' },
      public_notice: { type: ['string', 'null'] as any },
      additional_notices: { type: 'array', items: { type: 'string' } },
      description: {
        type: 'object',
        additionalProperties: { type: 'string' },
        required: [],
      },
      links: {
        type: 'object',
        properties: {
          homepage: { type: 'array', items: { type: 'string' } },
          whitepaper: { type: 'string' },
          blockchain_site: { type: 'array', items: { type: 'string' } },
          official_forum_url: { type: 'array', items: { type: 'string' } },
          chat_url: { type: 'array', items: { type: 'string' } },
          announcement_url: { type: 'array', items: { type: 'string' } },
          twitter_screen_name: { type: 'string' },
          facebook_username: { type: 'string' },
          telegram_channel_identifier: { type: 'string' },
          subreddit_url: { type: 'string' },
          bitcointalk_thread_identifier: { type: ['string', 'null'] as any },
          repos_url: {
            type: 'object',
            properties: {
              github: { type: 'array', items: { type: 'string' } },
              bitbucket: { type: 'array', items: { type: 'string' } },
            },
            required: [],
            additionalProperties: false,
          },
        },
        required: [
          'homepage',
          'whitepaper',
          'blockchain_site',
          'official_forum_url',
          'chat_url',
          'announcement_url',
          'twitter_screen_name',
          'facebook_username',
        ],
        additionalProperties: false,
      },
      image: {
        type: 'object',
        properties: {
          thumb: { type: 'string' },
          small: { type: 'string' },
          large: { type: 'string' },
        },
        required: ['thumb', 'small', 'large'],
        additionalProperties: false,
      },
      country_origin: { type: 'string' },
      genesis_date: { type: ['string', 'null'] as any },
      sentiment_votes_up_percentage: { type: 'number' },
      sentiment_votes_down_percentage: { type: 'number' },
      watchlist_portfolio_users: { type: 'number' },
      market_cap_rank: { type: 'number' },
      market_data: {
        type: 'object',
        properties: {
          current_price: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          total_value_locked: { type: ['number', 'null'] as any },
          mcap_to_tvl_ratio: { type: ['number', 'null'] as any },
          fdv_to_tvl_ratio: { type: ['number', 'null'] as any },
          roi: { type: ['number', 'null'] as any },
          ath: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          ath_change_percentage: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          ath_date: {
            type: 'object',
            additionalProperties: { type: 'string' },
            required: [],
          },
          atl: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          atl_change_percentage: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          atl_date: {
            type: 'object',
            additionalProperties: { type: 'string' },
            required: [],
          },
          market_cap: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          market_cap_rank: { type: 'number' },
          fully_diluted_valuation: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          market_cap_fdv_ratio: { type: ['number', 'null'] as any },
          total_volume: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          high_24h: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          low_24h: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          price_change_24h: { type: 'number' },
          price_change_percentage_24h: { type: 'number' },
          price_change_percentage_7d: { type: 'number' },
          price_change_percentage_14d: { type: 'number' },
          price_change_percentage_30d: { type: 'number' },
          price_change_percentage_60d: { type: 'number' },
          price_change_percentage_200d: { type: 'number' },
          price_change_percentage_1y: { type: 'number' },
          market_cap_change_24h: { type: 'number' },
          market_cap_change_percentage_24h: { type: 'number' },
          price_change_24h_in_currency: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          price_change_percentage_1h_in_currency: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          price_change_percentage_24h_in_currency: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          price_change_percentage_7d_in_currency: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          price_change_percentage_14d_in_currency: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          price_change_percentage_30d_in_currency: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          price_change_percentage_60d_in_currency: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          price_change_percentage_200d_in_currency: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          price_change_percentage_1y_in_currency: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          market_cap_change_24h_in_currency: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          market_cap_change_percentage_24h_in_currency: {
            type: 'object',
            additionalProperties: { type: 'number' },
            required: [],
          },
          total_supply: { type: 'number' },
          max_supply: { type: ['number', 'null'] as any },
          circulating_supply: { type: 'number' },
          sparkline_in_7d: {
            type: 'object',
            properties: {
              price: {
                type: 'array',
                items: { type: 'number' },
              },
            },
            required: ['price'],
          },
          last_updated: { type: 'string' },
        },
        required: [
          'current_price',
          'total_volume',
          'high_24h',
          'low_24h',
          'price_change_24h',
          'price_change_percentage_24h',
          'price_change_percentage_7d',
          'market_cap_change_24h',
          'market_cap_change_percentage_24h',
          'price_change_24h_in_currency',
          'price_change_percentage_1h_in_currency',
          'price_change_percentage_24h_in_currency',
          'price_change_percentage_7d_in_currency',
          'market_cap_change_24h_in_currency',
          'market_cap_change_percentage_24h_in_currency',
        ],
        additionalProperties: true,
      },
      status_updates: {
        type: 'array',
        items: {
          type: 'object',
          properties: {},
          additionalProperties: true,
        },
      },
      last_updated: { type: 'string' },
      tickers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            base: { type: 'string' },
            target: { type: 'string' },
            market: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                identifier: { type: 'string' },
                has_trading_incentive: { type: 'boolean' },
              },
              required: ['name', 'identifier', 'has_trading_incentive'],
              additionalProperties: false,
            },
            last: { type: 'number' },
            volume: { type: 'number' },
            converted_last: {
              type: 'object',
              properties: {
                btc: { type: 'number' },
                eth: { type: 'number' },
                usd: { type: 'number' },
              },
              required: ['btc', 'eth', 'usd'],
              additionalProperties: false,
            },
            converted_volume: {
              type: 'object',
              properties: {
                btc: { type: 'number' },
                eth: { type: 'number' },
                usd: { type: 'number' },
              },
              required: ['btc', 'eth', 'usd'],
              additionalProperties: false,
            },
            trust_score: { type: 'string' },
            bid_ask_spread_percentage: { type: 'number' },
            timestamp: { type: 'string' },
            last_traded_at: { type: 'string' },
            last_fetch_at: { type: 'string' },
            is_anomaly: { type: 'boolean' },
            is_stale: { type: 'boolean' },
            trade_url: { type: ['string', 'null'] as any },
            token_info_url: { type: ['string', 'null'] as any },
            coin_id: { type: 'string' },
            target_coin_id: { type: 'string' },
          },
          required: [],
          additionalProperties: false,
        },
      },
    },
    required: [
      'id',
      'symbol',
      'name',
      'web_slug',
      'asset_platform_id',
      'platforms',
      'detail_platforms',
      'block_time_in_minutes',
      'hashing_algorithm',
      'categories',
      'preview_listing',
      'public_notice',
      'additional_notices',
      'description',
      'links',
      'image',
      'country_origin',
      'genesis_date',
      'sentiment_votes_up_percentage',
      'sentiment_votes_down_percentage',
      'watchlist_portfolio_users',
      'market_cap_rank',
      'market_data',
      'status_updates',
      'last_updated',
      'tickers',
    ],
    additionalProperties: true,
  };
