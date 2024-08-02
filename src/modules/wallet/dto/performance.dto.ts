import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { WalletPerformanceDurationEnum } from '../wallet.enum';
import { Type } from 'class-transformer';

export class WalletPerformanceDto {
  @ApiPropertyOptional()
  @IsEnum(WalletPerformanceDurationEnum)
  duration: WalletPerformanceDurationEnum = WalletPerformanceDurationEnum.ALL;
}

class Graph {
  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  balance: number;
}

export class WalletPerformanceResponseDto {
  @ApiProperty({ type: [Graph] })
  @Type(() => Graph)
  graph: Graph[];

  @ApiProperty()
  finalBalance: number;

  @ApiProperty()
  balanceChange: number;

  @ApiProperty()
  balanceChangePercentage: string;

  constructor(partial: Partial<WalletPerformanceResponseDto>) {
    Object.assign(this, partial);
  }
}
