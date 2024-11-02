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
  @IsNotEmpty()
  nonce: string;

  @ApiProperty({
    description: 'Initialization code in hex format',
    example: '0x...',
  })
  @IsString()
  @IsNotEmpty()
  initCode: string;

  @ApiProperty({
    description: 'Call data in hex format',
    example: '0x...',
  })
  @IsString()
  @IsNotEmpty()
  callData: string;

  @ApiProperty({
    description: 'Call gas limit',
    example: '21000',
  })
  @IsString()
  @IsNotEmpty()
  callGasLimit: string;

  @ApiProperty({
    description: 'Verification gas limit',
    example: '21000',
  })
  @IsString()
  @IsNotEmpty()
  verificationGasLimit: string;

  @ApiProperty({
    description: 'Pre-verification gas value',
    example: '21000',
  })
  @IsString()
  @IsNotEmpty()
  preVerificationGas: string;

  @ApiProperty({
    description: 'Max fee per gas',
    example: '1000000000', // 1 gwei in wei
  })
  @IsString()
  @IsNotEmpty()
  maxFeePerGas: string;

  @ApiProperty({
    description: 'Max priority fee per gas',
    example: '1000000000', // 1 gwei in wei
  })
  @IsString()
  @IsNotEmpty()
  maxPriorityFeePerGas: string;

  @ApiProperty({
    description: 'Paymaster and data',
    example: '0x...',
  })
  @IsString()
  @IsNotEmpty()
  paymasterAndData: string;

  @ApiProperty({
    description: 'Signature for the operation',
    example: '0x...',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;
}
