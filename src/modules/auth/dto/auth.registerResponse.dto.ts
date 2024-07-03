import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'The status of the response',
    example: 'Success',
  })
  status: string;

  @ApiProperty({
    description: 'The message accompanying the response',
  })
  message: string;

  @ApiProperty({
    description: 'The data of the response',
    nullable: true,
  })
  data: null;


  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
