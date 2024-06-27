import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAllTransactionsDto {
  @ApiPropertyOptional()
  count?: number;

  @ApiPropertyOptional()
  page?: number;
}

export class GetAllTransactionsResponseDto {
  requestDate: string;
  amount: number;
  equivalentUsdAmt: number;
  currency: string;
  transactionID: string;
  rejectReason: null | string;
  comments: null | string;
  status: null | string;
  type: string;
  currentTxnCount: number;
  requiredTxnCount: number;
  explorerURL: string;
  address: string;
  confirmDate: string;
  fee: number;
  pgName: null | string;
  memo: null | string;
  isPassedTravelRule: boolean;

  constructor(partial: Partial<GetAllTransactionsResponseDto>) {
    Object.assign(this, partial);
  }
}
