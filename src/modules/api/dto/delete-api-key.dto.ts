import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class DeleteApiKeyDto {
  @ApiProperty({ name: 'key', description: 'Public key', required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  key: string;
}
