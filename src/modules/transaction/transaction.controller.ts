import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetAllTransactionsDto,
  GetAllTransactionsResponseDto,
} from './dto/transaction.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseValidationInterceptor } from 'src/common/response-validator.interceptor';
import { getAllTransactionsResponseSchema } from './transaction.schema';

@ApiBearerAuth()
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(getAllTransactionsResponseSchema),
  )
  @Get('/')
  async getAllTransactions(
    @Query() getAllTransactionsDto: GetAllTransactionsDto,
  ) {
    const { pageInfo, rows } = await this.transactionService.getAllTransactions(
      getAllTransactionsDto,
    );

    const result = rows.map((transaction) => {
      return new GetAllTransactionsResponseDto({
        currency: transaction.currency,
        amount: transaction.amount,
        status: transaction.status,
        type: transaction.type,
        fee: transaction.fee,
        memo: transaction.memo,
        address: transaction.address,
        pgName: transaction.pg_name,
        comments: transaction.comments,
        confirmDate: transaction.confirmDate,
        explorerURL: transaction.explorerURL,
        requestDate: transaction.requestDate,
        rejectReason: transaction.rejectReason,
        transactionID: transaction.transactionID,
        currentTxnCount: transaction.currentTxnCount,
        equivalentUsdAmt: transaction.equivalentUsdAmt,
        requiredTxnCount: transaction.requiredTxnCount,
        isPassedTravelRule: transaction.isPassedTravelRule,
      });
    });

    return { pageInfo, result };
  }
}
