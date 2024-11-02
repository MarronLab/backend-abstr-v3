import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SafeSignatureDto {
  @ApiProperty({
    description: 'Address of the signer',
    example: '0xabc123...',
  })
  @IsString()
  @IsNotEmpty()
  signer: string;

  @ApiProperty({
    description: 'Signature data',
    example: '0xabcdef...',
  })
  @IsString()
  @IsNotEmpty()
  data: string;
}
