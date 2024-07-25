import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class DeleteWhiteListedDeviceRequestDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class DeleteWhiteListedDeviceResponseDto {
  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({ required: false, type: 'string', nullable: true })
  data: string | null;
}
