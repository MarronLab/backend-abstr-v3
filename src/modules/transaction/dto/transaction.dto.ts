import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetAllTransactionsDto {
  @ApiPropertyOptional()
  count?: number;

  @ApiPropertyOptional()
  page?: number;
}

export class PageInfoResponseDto {
  @ApiProperty()
  totalRows: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;
}

export class TransactionResponseDto {
  @ApiProperty()
  requestDate: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  equivalentUsdAmt: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  transactionID: string;

  @ApiProperty({ type: String, nullable: true })
  rejectReason: null | string;

  @ApiProperty({ type: String, nullable: true })
  comments: null | string;

  @ApiProperty({ type: String, nullable: true })
  status: null | string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  currentTxnCount: number;

  @ApiProperty()
  requiredTxnCount: number;

  @ApiProperty()
  explorerURL: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  confirmDate: string;

  @ApiProperty()
  fee: number;

  @ApiProperty({ type: String, nullable: true })
  pgName: null | string;

  @ApiProperty({ type: String, nullable: true })
  memo: null | string;

  @ApiProperty()
  isPassedTravelRule: boolean;

  constructor(partial: Partial<TransactionResponseDto>) {
    Object.assign(this, partial);
  }
}

export class GetAllTransactionsResponseDto {
  @ApiProperty({ type: PageInfoResponseDto })
  @Type(() => PageInfoResponseDto)
  pageInfo: PageInfoResponseDto;

  @ApiProperty({ type: [TransactionResponseDto] })
  @Type(() => TransactionResponseDto)
  result: TransactionResponseDto[];

  constructor(partial: Partial<GetAllTransactionsResponseDto>) {
    Object.assign(this, partial);
  }
}
