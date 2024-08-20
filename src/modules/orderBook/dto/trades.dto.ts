import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { OrderSideExtendedEnum } from 'src/services/modulus/modulus.enum';
import { Type } from 'class-transformer';

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

export class Trade {
  @ApiProperty({
    description: 'Price at which the order was placed.',
    example: 45000.75,
  })
  limitPrice: number;

  @ApiProperty({
    description: 'Size of the order.',
    example: 1.0,
  })
  size: number;

  constructor(partial: Partial<Trade>) {
    Object.assign(this, partial);
  }
}

export class TradesResponseDto {
  @ApiProperty({
    type: [Trade],
    description: 'List of open orders.',
  })
  @Type(() => Trade)
  sell: Trade[];

  @ApiProperty({
    type: [Trade],
    description: 'List of open orders.',
  })
  @Type(() => Trade)
  buy: Trade[];

  constructor(partial: Partial<TradesResponseDto>) {
    Object.assign(this, partial);
  }
}
