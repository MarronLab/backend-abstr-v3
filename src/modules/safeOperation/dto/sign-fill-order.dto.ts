// src/order/dto/create-order.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignFillOrderDto {
  @IsNotEmpty()
  @IsString()
  maker: string;

  @IsNotEmpty()
  @IsString()
  taker: string;

  @IsNotEmpty()
  @IsString()
  exchangeProxyAddress: string;

  @IsNotEmpty()
  @IsString()
  makerToken: string;

  @IsNotEmpty()
  @IsString()
  takerToken: string;

  @IsNotEmpty()
  @IsString()
  makerAssetAmount: string;

  @IsNotEmpty()
  @IsString()
  takerAssetAmount: string;

  @IsNotEmpty()
  @IsString()
  expiryUnixTimestamp: string;

  @IsNotEmpty()
  @IsString()
  pool: string;

  @IsNotEmpty()
  @IsNumber()
  salt: number;
}
