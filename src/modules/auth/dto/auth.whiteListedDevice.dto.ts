import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDateString,
  ValidateNested,
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

  @IsDateString()
  addedOn: string;
}

export class GetWhiteListedDevicesResponseDto {
  @IsString()
  status: 'Success';

  @IsString()
  message: string;

  @ValidateNested()
  @Type(() => GetWhiteListedDevicesDataDto)
  data: GetWhiteListedDevicesDataDto;
}
