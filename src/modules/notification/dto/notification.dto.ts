import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetAllNotificationsDto {
  @ApiPropertyOptional()
  count?: number;

  @ApiPropertyOptional()
  page?: number;
}

export class PageInfoResponseDto {
  @ApiProperty()
  totalRows: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;
}

export class NotificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  cid: number;

  @ApiProperty()
  messageTitle: string;

  @ApiProperty()
  messageBody: string;

  @ApiProperty()
  addedOn: string;

  constructor(partial: Partial<NotificationResponseDto>) {
    Object.assign(this, partial);
  }
}

export class GetAllNotificationsResponseDto {
  @ApiProperty({ type: PageInfoResponseDto })
  @Type(() => PageInfoResponseDto)
  pageInfo: PageInfoResponseDto;

  @ApiProperty({ type: [NotificationResponseDto] })
  @Type(() => NotificationResponseDto)
  result: NotificationResponseDto[];

  constructor(partial: Partial<GetAllNotificationsResponseDto>) {
    Object.assign(this, partial);
  }
}
