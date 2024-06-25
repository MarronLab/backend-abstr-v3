import { Injectable } from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';

@Injectable()
export class TransactionService {
  constructor(private readonly modulusService: ModulusService) {}
}
