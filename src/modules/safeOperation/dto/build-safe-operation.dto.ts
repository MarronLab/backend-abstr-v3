import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { SafeSignatureDto } from './safe-signature.dto';

export class BuildSafeOperationDto {
  @ApiProperty({
    description: 'Address of the target',
    example: '0xabc123...',
  })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({
    description: 'Transaction value',
    example: '1000000000000000000', // 1 ether in wei as an example
  })
  @IsString()
  value: string;

  @ApiProperty({
    description: 'Transaction data in hexadecimal format',
    example: '0x...',
  })
  @IsString()
  data: string;

  @ApiProperty({
    description: 'Nonce of the transaction',
    example: '0',
  })
  @IsString()
  nonce: string;

  @ApiProperty({
    description: 'User address',
    example: '0xabc123...',
  })
  @IsString()
  userAddress: string;

  @ApiProperty({
    description: 'Safe address',
    example: '0xdef456...',
  })
  @IsString()
  safeAddress: string;

  @ApiProperty({
    description: 'User signature of the user operation',
    type: SafeSignatureDto,
  })
  userSignature: SafeSignatureDto;

  @ApiProperty({
    description: 'Is initialization code',
    example: true,
  })
  @IsBoolean()
  isInitCode: boolean;
}
