import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import {
  OrderSideEnum,
  OrderSideExtendedEnum,
} from 'src/services/modulus/modulus.enum';

export class TradesDto {
  @ApiProperty({
    enum: OrderSideExtendedEnum,
    description:
      'Side of the order, indicating whether it is a BUY or SELL. Extended options may include both sides.',
    example: OrderSideExtendedEnum.ALL,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(OrderSideExtendedEnum)
  side: OrderSideExtendedEnum;

  @ApiProperty({
    description:
      'Trading pair for the pending orders (e.g., BTC-ETH). Also accepts `ALL`',
    example: 'BTC-ETH',
  })
  @IsDefined()
  @IsNotEmpty()
  pair: string;
}

export class TradesResponseDto {
  @ApiProperty({
    description: 'Side of the order, indicating whether it is a BUY or SELL.',
    enum: OrderSideEnum,
    example: 'SELL',
  })
  side: OrderSideEnum;

  @ApiProperty({
    description: 'Price at which the trade was executed.',
    example: 45000.75,
  })
  price: number;

  @ApiProperty({
    description: 'Size of the trade.',
    example: 1.0,
  })
  size: number;

  @ApiProperty({
    description: 'Total of the trade. i.e limitPrice * size',
    example: 1.0,
  })
  total: number;

  constructor(partial: Partial<TradesResponseDto>) {
    Object.assign(this, partial);
  }
}
