import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ExtraData: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  CurrencyPair: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  Side: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  Size: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  LimitPrice: number;
}

export class CreateOrderResponseDto {
  @ApiProperty({ type: Object })
  extraData: any;

  @ApiProperty()
  size: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  timestamp: string;

  constructor(partial: Partial<CreateOrderResponseDto>) {
    Object.assign(this, partial);
  }
}

export class CancelOrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  et: number;

  @ApiProperty()
  etm: number;

  constructor(partial: Partial<CancelOrderResponseDto>) {
    Object.assign(this, partial);
  }
}
