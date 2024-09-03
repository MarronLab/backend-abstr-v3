import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetAllTransactionsDto {
  @ApiPropertyOptional({
    description:
      'The cursor returned in the previous response (used for getting the next page).',
  })
  cursor?: string;

  @ApiPropertyOptional({
    description: 'The desired page size of the result.',
  })
  limit?: number;
}

export class TransactionResponseDto {
  @ApiProperty({
    description: 'The hash of the transaction',
    example: '0x057Ec652A4F150f7FF94f089A38008f49a0DF88e',
  })
  hash: string;

  @ApiProperty({
    description: 'The value of the transaction in wei',
    example: 6500,
  })
  value: number;

  @ApiProperty({
    description: 'The token symbol',
    example: 'ETH',
  })
  tokenSymbol: string;

  @ApiProperty({
    description:
      'The status of the transaction receipt (1 indicates success, 0 indicates failure)',
    example: '1',
  })
  receiptStatus: string;

  @ApiProperty({
    description: 'The token type',
    example: 'erc20',
  })
  type: string;

  @ApiProperty({
    description: 'The direction of the transaction',
    example: 'receive',
  })
  direction: string;

  @ApiProperty({
    description: 'The timestamp of the block',
    example: '2021-04-02T10:07:54.000Z',
  })
  blockTimestamp: string;

  constructor(partial: Partial<TransactionResponseDto>) {
    Object.assign(this, partial);
  }
}

export class GetAllTransactionsResponseDto {
  @ApiProperty({
    description: 'The cursor for the next page of results',
    nullable: true,
  })
  cursor: string | null;

  @ApiProperty({
    description: 'The current page number',
    example: 2,
  })
  page: number;

  @ApiProperty({
    description: 'The number of results per page',
    example: 100,
  })
  pageSize: number;

  @ApiProperty({ type: [TransactionResponseDto] })
  @Type(() => TransactionResponseDto)
  result: TransactionResponseDto[];

  constructor(partial: Partial<GetAllTransactionsResponseDto>) {
    Object.assign(this, partial);
  }
}
