import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class GenerateApiKeyDto {
  @ApiProperty({
    name: 'keyType',
    description: 'Api key type e.g trade, readonly',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  keyType: string;

  @ApiProperty({
    name: 'twoFactorAuthKey',
    description: '2Factor authorization key for verification',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  twoFactorAuthKey: string;

  @ApiProperty({
    name: 'ipAddresses',
    description: 'A comma-seperated list of IP addresses',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  ipAddresses: string;
}

export class GenerateApiKeyResponseDto {
  @ApiProperty()
  publicKey: string;

  @ApiProperty()
  privateKey: string;

  constructor(partial: Partial<GenerateApiKeyResponseDto>) {
    Object.assign(this, partial);
  }
}
