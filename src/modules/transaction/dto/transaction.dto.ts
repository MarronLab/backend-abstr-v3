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
    description: 'The nonce of the transaction',
    example: '326595425',
  })
  nonce: string;

  @ApiProperty({
    description: 'The index of the transaction within the block',
    example: '25',
  })
  transactionIndex: string;

  @ApiProperty({
    nullable: true,
  })
  fromAddressEntity: null | string;

  @ApiProperty({
    nullable: true,
  })
  fromAddressEntityLogo: null | string;

  @ApiProperty({
    description: 'The address sending the transaction',
    example: '0xd4a3BebD824189481FC45363602b83C9c7e9cbDf',
  })
  fromAddress: string;

  @ApiProperty({
    description: 'Label for the address sending the transaction',
    example: 'Binance 1',
    nullable: true,
  })
  fromAddressLabel: null | string;

  @ApiProperty({
    nullable: true,
  })
  toAddressEntity: null | string;

  @ApiProperty({
    nullable: true,
  })
  toAddressEntityLogo: null | string;

  @ApiProperty({
    description: 'The address receiving the transaction',
    example: '0xa71db868318f0a0bae9411347cd4a6fa23d8d4ef',
  })
  toAddress: string;

  @ApiProperty({
    description: 'Label for the address receiving the transaction',
    example: 'Binance 1',
    nullable: true,
  })
  toAddressLabel: null | string;

  @ApiProperty({
    description: 'The value of the transaction in wei',
    example: '650000000000000000',
  })
  value: string;

  @ApiProperty({
    description: 'The gas limit provided by the sender',
    example: '6721975',
  })
  gas: string;

  @ApiProperty({
    description: 'The gas price provided by the sender in wei',
    example: '20000000000',
  })
  gasPrice: string;

  @ApiProperty({
    description: 'The input data sent along with the transaction',
  })
  input: string;

  @ApiProperty({
    description:
      'The total amount of gas used when this transaction was executed in the block',
    example: '1340925',
  })
  receiptCumulativeGasUsed: string;

  @ApiProperty({
    description: 'The amount of gas used by this specific transaction',
    example: '1340925',
  })
  receiptGasUsed: string;

  @ApiProperty({
    description:
      'The contract address created, if this was a contract creation transaction',
    example: '0x1d6a4cf64b52f6c73f201839aded7379ce58059c',
    nullable: true,
  })
  receiptContractAddress: null | string;

  @ApiProperty({
    description: 'The root of the receipt',
    nullable: true,
  })
  receiptRoot: null | string;

  @ApiProperty({
    description:
      'The status of the transaction receipt (1 indicates success, 0 indicates failure)',
    example: '1',
  })
  receiptStatus: string;

  @ApiProperty({
    description: 'The transaction fee in ETH',
    example: '0.00034',
  })
  transactionFee: string;

  @ApiProperty({
    description: 'The timestamp of the block',
    example: '2021-04-02T10:07:54.000Z',
  })
  blockTimestamp: string;

  @ApiProperty({
    description: 'The block number of the transaction',
    example: '12526958',
  })
  blockNumber: string;

  @ApiProperty({
    description: 'The hash of the block',
    example:
      '0x0372c302e3c52e8f2e15d155e2c545e6d802e479236564af052759253b20fd86',
  })
  blockHash: string;

  constructor(partial: Partial<TransactionResponseDto>) {
    Object.assign(this, partial);
  }
}

export class GetAllTransactionsResponseDto {
  @ApiProperty({
    description: 'The cursor for the next page of results',
  })
  cursor: string;

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
