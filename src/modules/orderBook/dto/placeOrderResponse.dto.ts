import { ApiProperty } from '@nestjs/swagger';
import {
  OrderSideEnum,
  OrderTypeEnum,
} from 'src/services/modulus/modulus.enum';

export class PlaceOrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  side: OrderSideEnum;

  @ApiProperty()
  type: OrderTypeEnum;

  @ApiProperty()
  size: number;

  @ApiProperty()
  filled: number;

  @ApiProperty()
  remaining: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  filledPrice: number;

  @ApiProperty()
  metadata: string;

  constructor(partial: Partial<PlaceOrderResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PlaceOrderPricedResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  side: OrderSideEnum;

  @ApiProperty()
  type: OrderTypeEnum;

  @ApiProperty()
  size: number;

  @ApiProperty()
  filled: number;

  @ApiProperty()
  remaining: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  filledPrice: number;

  @ApiProperty()
  metadata: string;

  constructor(partial: Partial<PlaceOrderPricedResponseDto>) {
    Object.assign(this, partial);
  }
}
