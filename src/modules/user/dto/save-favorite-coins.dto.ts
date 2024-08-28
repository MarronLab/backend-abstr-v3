import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
export class SaveFavoriteCoinsDto {
  @ApiProperty({
    description: 'ID of the coin to add or remove',
    example: 'bitcoin',
  })
  @IsString()
  @IsNotEmpty()
  coinId: string;

  @ApiProperty({
    description:
      'Whether to add (true) or remove (false) the coin from favorites',
    example: true,
  })
  @IsBoolean()
  watchlist: boolean;
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
