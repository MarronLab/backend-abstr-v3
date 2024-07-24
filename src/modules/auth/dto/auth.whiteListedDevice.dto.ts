import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDateString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetWhiteListedDevicesDataDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  deviceID: string;

  @ApiProperty()
  @IsString()
  browser: string;

  @ApiProperty()
  @IsString()
  os: string;

  @ApiProperty()
  @IsString()
  device: string;

  @ApiProperty()
  @IsString()
  ip: string;

  @ApiProperty()
  @IsDateString()
  addedOn: string;

  constructor(partial: Partial<GetWhiteListedDevicesDataDto>) {
    Object.assign(this, partial);
  }
}

export default class GetWhiteListedDevicesResponseDto {
  @IsString()
  status: 'Success';

  @IsString()
  message: string;

  @ApiProperty({ type: [GetWhiteListedDevicesDataDto] })
  @ValidateNested({ each: true })
  @Type(() => GetWhiteListedDevicesDataDto)
  @IsArray()
  data: GetWhiteListedDevicesDataDto[];

  constructor(partial: Partial<GetWhiteListedDevicesResponseDto>) {
    Object.assign(this, partial);
  }
}
