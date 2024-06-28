export class RegisterResponseDto {
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  country: string;
  mobile: string;
  password: string;
  referralId: string;
  mobileOTP: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
