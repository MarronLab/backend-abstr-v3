import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GetAllTransactionsDto } from './dto/transaction.dto';
import { MoralisService } from 'src/services/moralis/moralis.service';
import HelperProvider from 'src/utils/helperProvider';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly moralisService: MoralisService,
    private readonly settingsService: SettingsService,
  ) {}
  async getAllTransactions(
    address: string,
    getAllTransactionsDto: GetAllTransactionsDto,
  ) {
    try {
      const data = await this.settingsService.getApiSettings();

      if (!data.supportedAssets) {
        throw new UnprocessableEntityException();
      }

      const response = await this.moralisService.transactions({
        cursor: getAllTransactionsDto.cursor,
        limit: getAllTransactionsDto.limit,
        address,
        chain: HelperProvider.getNetworkName(),
      });

      const result = this.moralisService.flattenMoralisTransaction(
        response.result,
      );

      const transactions = data.supportedAssets
        .map((asset) => {
          const transaction = result.find(
            (x) =>
              x.token_symbol.toLowerCase() === asset!.shortName.toLowerCase(),
          );

          return transaction;
        })
        .filter((transaction) => transaction !== undefined) as {
        hash: string;
        block_timestamp: string;
        receipt_status: string;
        token_symbol: string;
        value: number;
        direction: string;
        type: string;
      }[];

      return { ...response, result: transactions };
    } catch (error) {
      console.log('ERROR: ', error);
      throw new InternalServerErrorException(error);
    }
  }
}
