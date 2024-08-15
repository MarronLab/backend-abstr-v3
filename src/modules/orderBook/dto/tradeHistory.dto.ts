import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { OrderSideExtendedEnum } from 'src/services/modulus/modulus.enum';

export class TradeHistoryDto {
  @ApiProperty({
    enum: OrderSideExtendedEnum,
    description:
      'Side of the trade, indicating whether it is a BUY or SELL. Extended options may include both sides.',
    example: OrderSideExtendedEnum.ALL,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(OrderSideExtendedEnum)
  side: OrderSideExtendedEnum;

  @ApiProperty({
    example: 'BTC-ETH',
    description:
      'Trading pair for the trade history (e.g., BTC-ETH). Also accepts `ALL`',
  })
  @IsDefined()
  @IsNotEmpty()
  pair: string;

  @ApiPropertyOptional({
    description:
      'Number of records to retrieve. Defaults to a predefined number if not provided.',
    example: 10,
  })
  count?: number;

  @ApiPropertyOptional({
    description:
      'Page number to retrieve in a paginated result set. Defaults to 1',
    example: 1,
  })
  page?: number;
}
