import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import {
  OrderSideEnum,
  OrderTimeInForceEnum,
  OrderTypeEnum,
} from '../../../services/modulus/modulus.enum';

export class PlaceOrderDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(OrderSideEnum)
  side: OrderSideEnum;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  market: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  trade: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(OrderTypeEnum)
  type: OrderTypeEnum;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  volume: number;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @ValidateIf(
    (o) => o.type === OrderTypeEnum.LIMIT && o.type === OrderTypeEnum.STOPLIMIT,
  )
  rate: number;

  @ApiProperty()
  @IsEnum(OrderTimeInForceEnum)
  @ValidateIf(
    (o) =>
      o.type === OrderTypeEnum.LIMIT && o.type === OrderTypeEnum.STOPMARKET,
  )
  timeInForce: OrderTimeInForceEnum = OrderTimeInForceEnum.GTC;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateIf(
    (o) =>
      o.type === OrderTypeEnum.STOPLIMIT && o.type === OrderTypeEnum.STOPMARKET,
  )
  clientOrderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ValidateIf(
    (o) =>
      o.type === OrderTypeEnum.STOPLIMIT && o.type === OrderTypeEnum.STOPMARKET,
  )
  stop: number;
}

export class PlaceOrderPricedDto extends PickType(PlaceOrderDto, [
  'side',
  'market',
  'trade',
] as const) {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
