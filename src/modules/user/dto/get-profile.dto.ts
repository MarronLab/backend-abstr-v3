import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Discounts {
  @ApiProperty()
  tokenDiscount: number;

  @ApiProperty()
  feeGroups: number;

  @ApiProperty()
  volumeDiscount: number;

  @ApiProperty()
  totalDiscount: number;
}

export class GetProfileResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  loginName: string;

  @ApiProperty()
  joinedOn: string;

  @ApiProperty()
  is2FAEnabled: boolean;

  @ApiProperty()
  isMobileVerified: boolean;

  @ApiProperty()
  kycStatus: string;

  @ApiProperty({ type: String, nullable: true })
  kycApprovedBy: null | string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  mobileNumber: string;

  @ApiProperty()
  kycRejectReason: string;

  @ApiProperty()
  kycRequestInfo: string;

  @ApiProperty({ type: String, nullable: true })
  kycApprovedLevel: null | string;

  @ApiProperty({ type: String, nullable: true })
  currentStatus: null | string;

  @ApiProperty()
  isUserBlocked: boolean;

  @ApiProperty()
  corporateName: string;

  @ApiProperty()
  priceChangeAlert: boolean;

  @ApiProperty()
  priceChangePercentage: string;

  @ApiProperty({ type: Discounts })
  @Type(() => Discounts)
  discounts: Discounts;

  @ApiProperty({ type: [Object] })
  customFields: any[];

  @ApiProperty()
  kycType: string;

  @ApiProperty({ type: String, nullable: true })
  language: string | null;

  @ApiProperty({ type: String, nullable: true })
  currency: string | null;

  @ApiProperty({ type: String, nullable: true })
  timezone: string | null;

  @ApiProperty({ type: String, nullable: true })
  username: string | null;

  @ApiProperty()
  safeAddress: string;

  @ApiProperty()
  userAddress: string;

  @ApiProperty()
  emailNewsletter: boolean;

  @ApiProperty()
  emailTradeUpdates: boolean;

  @ApiProperty()
  emailAnnouncements: boolean;

  @ApiProperty()
  publicID: string;

  @ApiProperty()
  userEmail: string | null;

  @ApiProperty({ type: Number, nullable: true })
  autoLogoutDuration: number | null;

  @ApiProperty({ type: Date, format: 'date-time', nullable: true })
  lastLoggedInAt: Date | null;

  constructor(partial: Partial<GetProfileResponseDto>) {
    Object.assign(this, partial);
  }
}
