import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserOperationDto } from './user-operation.dto';

export class BatchUserOperationDto {
  @ApiProperty({
    type: [UserOperationDto],
    description: 'Array of user operations',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserOperationDto) // Necessary to properly validate nested objects
  operations: UserOperationDto[];
}
