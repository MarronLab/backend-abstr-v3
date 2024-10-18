import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserOperationDto {
  @ApiProperty({
    description: 'Sender address',
    example: '0xabc123...',
  })
  @IsString()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({
    description: 'Nonce value',
    example: '1',
  })
  @IsString()
  nonce: string;

  @ApiProperty({
    description: 'Initialization code in hex format',
    example: '0x...',
  })
  @IsString()
  initCode: string;

  @ApiProperty({
    description: 'Call data in hex format',
    example: '0x...',
  })
  @IsString()
  callData: string;

  @ApiProperty({
    description: 'Call gas limit',
    example: '21000',
  })
  @IsString()
  callGasLimit: string;

  @ApiProperty({
    description: 'Verification gas limit',
    example: '21000',
  })
  @IsString()
  verificationGasLimit: string;

  @ApiProperty({
    description: 'Pre-verification gas value',
    example: '21000',
  })
  @IsString()
  preVerificationGas: string;

  @ApiProperty({
    description: 'Max fee per gas',
    example: '1000000000', // 1 gwei in wei
  })
  @IsString()
  maxFeePerGas: string;

  @ApiProperty({
    description: 'Max priority fee per gas',
    example: '1000000000', // 1 gwei in wei
  })
  @IsString()
  maxPriorityFeePerGas: string;

  @ApiProperty({
    description: 'Paymaster and data',
    example: '0x...',
  })
  @IsString()
  paymasterAndData: string;

  @ApiProperty({
    description: 'Signature for the operation',
    example: '0x...',
  })
  @IsString()
  signature: string;
}
