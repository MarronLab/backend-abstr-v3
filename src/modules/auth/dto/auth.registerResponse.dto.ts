import { ApiProperty } from '@nestjs/swagger';

export default class RegisterResponseDto {
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
    type: 'string',
  })
  data: string | null;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
