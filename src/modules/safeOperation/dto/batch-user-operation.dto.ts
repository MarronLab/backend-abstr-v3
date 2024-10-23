import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserOperationDto } from './user-operation.dto';

export class BatchUserOperationDto {
  @ApiProperty({
    type: () => [UserOperationDto],
    description: 'Array of user operations',
  })
  @ValidateNested({ each: true })
  @Type(() => UserOperationDto)
  operations: UserOperationDto[];
}
