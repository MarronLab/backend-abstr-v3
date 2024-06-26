import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAllNotificationsDto {
  @ApiPropertyOptional()
  count?: number;

  @ApiPropertyOptional()
  page?: number;
}

export class GetAllNotificationsResponseDto {
  id: number;
  cid: number;
  messageTitle: string;
  messageBody: string;
  addedOn: string;

  constructor(partial: Partial<GetAllNotificationsResponseDto>) {
    Object.assign(this, partial);
  }
}
