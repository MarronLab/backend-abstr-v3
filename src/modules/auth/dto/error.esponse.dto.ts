import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export default class ErrorResponseDto {
  @ApiProperty({
    description: 'Indicates if the operation was successful',
    required: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: 'Error message',
    required: true,
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Additional details about the error',
    required: false,
  })
  @IsString()
  details?: string;
}
