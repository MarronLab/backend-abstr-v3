import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import {
  OrderSideEnum,
  OrderSideExtendedEnum,
} from 'src/services/modulus/modulus.enum';

export class PendingOrdersDto {
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

export class PendingOrderResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the order.',
    example: 987654,
  })
  id: number;

  @ApiProperty({
    description: 'Market in which the order was occured (e.g., BTC).',
    example: 'BTC',
  })
  market: string;

  @ApiProperty({
    description: 'Identifier for the specific trade.',
    example: 'ETH',
  })
  trade: string;

  @ApiProperty({
    description: 'Volume of the order',
    example: 0.5,
  })
  volume: number;

  @ApiProperty({
    description: 'Exchange rate at which the order was executed.',
    example: 45000.75,
  })
  rate: number;

  @ApiProperty({
    description: 'Side of the order, indicating whether it is a BUY or SELL.',
    enum: OrderSideEnum,
    example: 'SELL',
  })
  side: OrderSideEnum;

  @ApiProperty({
    description: 'Date and time when the order was placed.',
    example: '2024-08-05T14:48:00Z',
    format: 'date-time',
  })
  date: string;

  constructor(partial: Partial<PendingOrderResponseDto>) {
    Object.assign(this, partial);
  }
}
