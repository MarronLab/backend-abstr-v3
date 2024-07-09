import { JSONSchemaType } from 'ajv';
import {
  TrendingMarketDataResponseDto,
  TopGainerLoserResponseDto,
  TopGainerLoserDataResponseDto,
} from '../../modules/market/dto/market.dto';

export const marketDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      symbol: { type: 'string' },
      name: { type: 'string' },
      image: { type: 'string' },
      current_price: { type: 'number' },
      market_cap: { type: ['number', 'null'] },
      market_cap_rank: { type: 'integer' },
      fully_diluted_valuation: { type: ['number', 'null'] },
      total_volume: { type: ['number', 'null'] },
      high_24h: { type: ['number', 'null'] },
      low_24h: { type: ['number', 'null'] },
      price_change_24h: { type: ['number', 'null'] },
      price_change_percentage_24h: { type: ['number', 'null'] },
      market_cap_change_24h: { type: ['number', 'null'] },
      market_cap_change_percentage_24h: { type: ['number', 'null'] },
      circulating_supply: { type: ['number', 'null'] },
      total_supply: { type: ['number', 'null'] },
      max_supply: { type: ['number', 'null'] },
      ath: { type: ['number', 'null'] },
      ath_change_percentage: { type: ['number', 'null'] },
      ath_date: { type: 'string' },
      atl: { type: ['number', 'null'] },
      atl_change_percentage: { type: ['number', 'null'] },
      atl_date: { type: 'string' },
      last_updated: { type: 'string' },
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
      // 'ath_date',
      'atl',
      'atl_change_percentage',
      // 'atl_date',
      // 'last_updated',
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
  price_btc: string;
  price_change_percentage_24h: {
    btc: number;
    usd: number;
  };
  market_cap: string;
  market_cap_btc: string;
  total_volume: string;
  total_volume_btc: string;
  sparkline: string;
}> = {
  type: 'object',
  properties: {
    price: { type: 'number' },
    price_btc: { type: 'string' },
    price_change_percentage_24h: priceChangePercentage24hSchema,
    market_cap: { type: 'string' },
    market_cap_btc: { type: 'string' },
    total_volume: { type: 'string' },
    total_volume_btc: { type: 'string' },
    sparkline: { type: 'string' },
  },
  required: [
    'price',
    'price_btc',
    'price_change_percentage_24h',
    'market_cap',
    'market_cap_btc',
    'total_volume',
    'total_volume_btc',
    'sparkline',
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
