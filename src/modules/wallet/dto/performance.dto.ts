import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { WalletPerformanceDurationEnum } from '../wallet.enum';

export class WalletPerformanceDto {
  @ApiPropertyOptional()
  @IsEnum(WalletPerformanceDurationEnum)
  duration: WalletPerformanceDurationEnum = WalletPerformanceDurationEnum.ALL;
}

export class WalletPerformanceResponseDto {
  graph: Record<string, number>[];
  finalBalance: number;
  balanceChange: number;
  balanceChangePercentage: string;

  constructor(partial: Partial<WalletPerformanceResponseDto>) {
    Object.assign(this, partial);
  }
}
