interface CoinStats {
  exchangeTicker: string;
  dataSource: string;
  coinName: string;
  symbol: string;
  slug: string;
  image: string;
  rank: number;
  price: string;
  volume24h: string;
  marketCap: string;
  priceChangePercent24hr: string;
  circulatingSupply: string;
  sparkline_in_7d: {
    price: number[];
  };
  maxSupply: string;
  priceChangePercent1h: string;
  priceChangePercent7d: string;
  priceChangePercent30: string;
  issueDate: string;
  lastUpdated: string;
  tags: string;
  tagsObject: string[];
  description: string;
  links_website: string;
  links_reddit: string | null;
  links_forum: string | null;
  links_explorer: string | null;
  links_sourceCode: string | null;
  objectlinks_sourceCode: string | null;
  links_technicalDoc: string | null;
  last_updatedon: string;
}

// Define the mock stats object
export const mockStats: CoinStats = {
  exchangeTicker: 'MOCK',
  dataSource: 'MockData',
  coinName: 'MockCoin',
  symbol: 'mock',
  slug: 'mockcoin',
  image: 'https://example.com/mockcoin.png', // Placeholder image URL
  rank: 9999,
  price: '0.0',
  volume24h: '0',
  marketCap: '0',
  priceChangePercent24hr: '0',
  circulatingSupply: '0',
  sparkline_in_7d: {
    price: [
      0.1, 0.12, 0.11, 0.13, 0.15, 0.14, 0.16, 0.18, 0.19, 0.2, 0.21, 0.22,
      0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.3, 0.31, 0.32, 0.33, 0.34,
      0.35, 0.36, 0.37, 0.38, 0.39, 0.4, 0.41, 0.42, 0.43, 0.44, 0.45, 0.46,
      0.47, 0.48, 0.49, 0.5,
    ],
  },
  maxSupply: '0',
  priceChangePercent1h: '0',
  priceChangePercent7d: '0',
  priceChangePercent30: '0',
  issueDate: '2023-01-01T00:00:00Z',
  lastUpdated: new Date().toISOString(),
  tags: 'Mock',
  tagsObject: ['Mock'],
  description: 'This is a mock asset used for testing purposes.',
  links_website: 'https://example.com',
  links_reddit: null,
  links_forum: null,
  links_explorer: null,
  links_sourceCode: null,
  objectlinks_sourceCode: null,
  links_technicalDoc: null,
  last_updatedon: new Date().toISOString(),
};
