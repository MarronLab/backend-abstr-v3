import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  IsObject,
  IsDateString,
} from 'class-validator';

class CurrencyDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  url: string;
}

class SourceDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  region: string;

  @ApiProperty()
  @IsString()
  domain: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  path: string;

  @ApiProperty()
  @IsString()
  type: string;
}

export class ResultDto {
  @ApiProperty()
  @IsString()
  kind: string;

  @ApiProperty()
  @IsString()
  domain: string;

  @ApiProperty()
  @IsObject()
  source: SourceDto;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsDateString()
  published_at: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  currencies: CurrencyDto[];

  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsDateString()
  created_at: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image: string;

  constructor(partial: Partial<ResultDto>) {
    Object.assign(this, partial);
  }
}

export class PostResponseDto {
  @ApiProperty()
  @IsInt()
  count: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  next: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  previous: string;

  @ApiProperty()
  @IsArray()
  results: ResultDto[];

  constructor(partial: Partial<PostResponseDto>) {
    Object.assign(this, partial);
  }
}
