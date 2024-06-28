export const marketDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      symbol: { type: 'string' },
      name: { type: 'string' },
      current_price: { type: 'number' },
      market_cap: { type: 'number' },
      market_cap_rank: { type: 'number' },
      sparkline_in_7d: {
        type: 'array',
        items: { type: 'number' },
      },
      price_change_percentage_24h: { type: 'number' },
    },
    required: [
      'id',
      'symbol',
      'name',
      'current_price',
      'market_cap',
      'market_cap_rank',
      'sparkline_in_7d',
      'price_change_percentage_24h',
    ],
  },
};
