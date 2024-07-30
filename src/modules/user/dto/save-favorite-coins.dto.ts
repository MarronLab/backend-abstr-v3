import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty } from 'class-validator';

export class SaveFavoriteCoinsDto {
  @ApiProperty({
    description: 'List of favorite coins',
    example: ['pepe', 'dai'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ArrayNotEmpty()
  data: string[];
}

export class SaveFavoriteCoinsResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: any;

  constructor(partial: Partial<SaveFavoriteCoinsResponseDto>) {
    Object.assign(this, partial);
  }
}
