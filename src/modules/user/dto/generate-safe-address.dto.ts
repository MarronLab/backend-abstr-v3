import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
    description: 'The modulus email',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  modulusCustomerEmail: string;
}

export class GenerateSafeAddressResponseDto {
  @ApiProperty()
  safeAddress: string;

  @ApiProperty()
  isSafeDeployed: boolean;

  @ApiProperty()
  initCode: string;

  constructor(partial: Partial<GenerateSafeAddressResponseDto>) {
    Object.assign(this, partial);
  }
}
