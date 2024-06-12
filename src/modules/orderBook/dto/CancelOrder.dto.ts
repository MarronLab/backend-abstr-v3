import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CancelOrderDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  pair: string;
}
