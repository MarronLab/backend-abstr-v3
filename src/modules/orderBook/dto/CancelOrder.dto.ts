import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CancelOrderDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ValidateIf((_, value) => ['ALL', 'SELL', 'BUY'].includes(value))
  side: 'ALL' | 'SELL' | 'BUY';
}
