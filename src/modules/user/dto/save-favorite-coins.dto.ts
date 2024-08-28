import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SaveFavoriteCoinsDto {
  @ApiProperty({
    description: 'List of favorite coins',
    example: 'bitcoin',
  })
  @IsString()
  @IsNotEmpty()
  data: string;
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
