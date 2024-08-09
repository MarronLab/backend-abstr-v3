import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetAllTransactionsDto } from './dto/transaction.dto';
import { MoralisService } from 'src/services/moralis/moralis.service';
import HelperProvider from 'src/utils/helperProvider';

@Injectable()
export class TransactionService {
  constructor(private readonly moralisService: MoralisService) {}
  async getAllTransactions(
    address: string,
    getAllTransactionsDto: GetAllTransactionsDto,
  ) {
    console.log('START: ');
    try {
      const response = await this.moralisService.transactions({
        cursor: getAllTransactionsDto.cursor,
        limit: getAllTransactionsDto.limit,
        address,
        chain: HelperProvider.getNetworkName(),
      });

      console.log('RESPONSE: ', response);

      return response;
    } catch (error) {
      console.log('ERROR: ', error);
      throw new InternalServerErrorException(error);
    }
  }
}
