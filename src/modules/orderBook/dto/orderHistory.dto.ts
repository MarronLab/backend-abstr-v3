import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { OrderSideExtendedEnum } from 'src/services/modulus/modulus.enum';

export class OrderHistoryDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(OrderSideExtendedEnum)
  side: OrderSideExtendedEnum;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  pair: string;

  @ApiPropertyOptional()
  count?: number;

  @ApiPropertyOptional()
  page?: number;
}
