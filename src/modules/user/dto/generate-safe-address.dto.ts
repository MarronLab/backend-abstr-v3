import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class GenerateSafeAddressDto {
  @ApiProperty({
    description: 'The user wallet address',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  userAddress: string;

  @ApiProperty({
    description: 'The modulus CustomerID',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  modulusCustomerID: number;
}

export class GenerateSafeAddressResponseDto {
  safeAddress: string;
  isSafeDeployed: boolean;
  initCode: string;

  constructor(partial: Partial<GenerateSafeAddressResponseDto>) {
    Object.assign(this, partial);
  }
}
