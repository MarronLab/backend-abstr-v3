import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { KeyTypeEnum } from 'src/services/modulus/modulus.enum';

export class ListApiKeysDto {
  @ApiPropertyOptional()
  @IsEnum(KeyTypeEnum)
  keyType: KeyTypeEnum = KeyTypeEnum.ALL;
}

export class ListApiKeyResponseDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  trustedIPs: string;

  @ApiProperty()
  generatedOn: string;

  @ApiProperty({ type: 'string' })
  lastHit: null | string;

  @ApiProperty()
  account: string;

  constructor(partial: Partial<ListApiKeyResponseDto>) {
    Object.assign(this, partial);
  }
}
