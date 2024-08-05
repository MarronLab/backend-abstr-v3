import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { OrderSideExtendedEnum } from 'src/services/modulus/modulus.enum';

export class OrderHistoryDto {
  @ApiProperty({ enum: OrderSideExtendedEnum })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(OrderSideExtendedEnum)
  side: OrderSideExtendedEnum;

  @ApiProperty({ example: 'BTC-ETH' })
  @IsDefined()
  @IsNotEmpty()
  pair: string;

  @ApiPropertyOptional()
  count?: number;

  @ApiPropertyOptional()
  page?: number;
}
