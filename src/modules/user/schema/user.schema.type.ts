export type GetProfileResponseSchemaType = {
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
  customFields: string[];
  kycType: string;
  language: string | null;
  currency: string | null;
  timezone: string | null;
  username: string | null;
  safeAddress: string;
  userAddress: string;
  emailNewsletter: boolean;
  emailTradeUpdates: boolean;
  emailAnnouncements: boolean;
  publicID: string;
  autoLogoutDuration: number | null;
  lastLoggedInAt: string;
};

export type GenerateSafeAddressResponseSchemaType = {
  safeAddress: string;
  isSafeDeployed: boolean;
  initCode: string;
};
