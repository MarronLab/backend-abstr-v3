import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { KeyTypeEnum } from 'src/services/modulus/modulus.enum';

export class ListApiKeysDto {
  @ApiPropertyOptional()
  @IsEnum(KeyTypeEnum)
  keyType: KeyTypeEnum = KeyTypeEnum.ALL;
}

export class ListApiKeysResponseDto {
  key: string;
  type: string;
  trustedIPs: string;
  generatedOn: string;
  lastHit: null | string;
  account: string;

  constructor(partial: Partial<ListApiKeysResponseDto>) {
    Object.assign(this, partial);
  }
}
