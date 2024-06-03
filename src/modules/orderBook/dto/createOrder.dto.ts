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

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  UserID: number;
}
