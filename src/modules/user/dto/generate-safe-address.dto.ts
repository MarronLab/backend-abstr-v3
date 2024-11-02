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

  // @ApiProperty({
  //   description: 'The user email',
  //   required: false,
  // })
  // @IsDefined()
  // @IsNotEmpty()
  // @IsEmail()
  // userEmail: string;
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
