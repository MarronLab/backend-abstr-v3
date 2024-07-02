export class RegisterResponseDto {
  email: string;
  password: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
