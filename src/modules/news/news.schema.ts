import { JSONSchemaType } from 'ajv';

interface CurrencyDto {
  code: string;
  title: string;
  slug: string;
  url: string;
}

interface SourceDto {
  title: string;
  region: string;
  domain: string;
  path?: string;
}

interface ResultDto {
  kind: string;
  domain: string;
  source: SourceDto;
  title: string;
  published_at: string;
  slug: string;
  currencies?: CurrencyDto[];
  id: number;
  url: string;
  created_at: string;
  description?: string;
  image?: string;
}

interface PostResponseDto {
  count: number;
  next?: string;
  previous?: string;
  results: ResultDto[];
}

const currencySchema: JSONSchemaType<CurrencyDto> = {
  type: 'object',
  properties: {
    code: { type: 'string' },
    title: { type: 'string' },
    slug: { type: 'string' },
    url: { type: 'string' },
  },
  required: ['code', 'title', 'slug', 'url'],
  additionalProperties: false,
};

const sourceSchema: JSONSchemaType<SourceDto> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    region: { type: 'string' },
    domain: { type: 'string' },
    path: { type: 'string', nullable: true },
    type: { type: 'string' },
  },
  required: ['title', 'region', 'domain'],
  additionalProperties: false,
};

const resultSchema: JSONSchemaType<ResultDto> = {
  type: 'object',
  properties: {
    kind: { type: 'string' },
    domain: { type: 'string' },
    source: sourceSchema,
    title: { type: 'string' },
    published_at: { type: 'string' },
    slug: { type: 'string' },
    currencies: { type: 'array', items: currencySchema, nullable: true },
    id: { type: 'number' },
    url: { type: 'string' },
    created_at: { type: 'string' },
    description: { type: 'string', nullable: true },
    image: { type: 'string', nullable: true },
  },
  required: [
    'kind',
    'domain',
    'source',
    'title',
    'published_at',
    'slug',
    'id',
    'url',
    'created_at',
  ],
  additionalProperties: false,
};

export const postResponseSchema: JSONSchemaType<PostResponseDto> = {
  type: 'object',
  properties: {
    count: { type: 'number' },
    next: { type: 'string', nullable: true },
    previous: { type: 'string', nullable: true },
    results: { type: 'array', items: resultSchema },
  },
  required: ['count', 'results'],
  additionalProperties: false,
};
