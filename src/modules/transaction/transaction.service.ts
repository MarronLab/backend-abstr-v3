import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { GetAllTransactionsDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly modulusService: ModulusService) {}
  async getAllTransactions(getAllTransactionsDto: GetAllTransactionsDto) {
    try {
      const { data } = await this.modulusService.getAllTransactions({
        page: getAllTransactionsDto.page,
        count: getAllTransactionsDto.count,
      });

      return data.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
