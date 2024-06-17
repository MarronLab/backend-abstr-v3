import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';

@Injectable()
export class AuthService {
  constructor(private readonly modulusService: ModulusService) {}

  async login(email: string, password: string) {
    return await this.modulusService.login(email, password);
  }
}
