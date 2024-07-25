import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class SaveFavoriteCoinsDto {
  @ApiProperty({
    description: 'List of favorite coins',
    example: ['LTC', 'BTC', 'USD'],
  })
  @IsArray()
  @IsString({ each: true })
  data: string[];
}

export class SaveFavoriteCoinsResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: any;
}
