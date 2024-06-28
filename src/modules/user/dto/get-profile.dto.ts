export class GetProfileResponseDto {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  loginName: string;
  joinedOn: string;
  is2FAEnabled: boolean;
  isMobileVerified: boolean;
  kycStatus: string;
  kycApprovedBy: null | string;
  country: string;
  mobileNumber: string;
  kycRejectReason: string;
  kycRequestInfo: string;
  kycApprovedLevel: null | string;
  currentStatus: null | string;
  isUserBlocked: boolean;
  corporateName: string;
  priceChangeAlert: boolean;
  priceChangePercentage: string;
  discounts: {
    tokenDiscount: number;
    feeGroups: number;
    volumeDiscount: number;
    totalDiscount: number;
  };
  customFields: any[];
  kycType: string;

  constructor(partial: Partial<GetProfileResponseDto>) {
    Object.assign(this, partial);
  }
}
