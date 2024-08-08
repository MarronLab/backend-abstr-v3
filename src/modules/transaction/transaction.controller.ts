import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  GetAllTransactionsDto,
  GetAllTransactionsResponseDto,
  TransactionResponseDto,
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
  @ApiOperation({ summary: 'Fetch transactions' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiOkResponse({
    description: 'The transactions has been successfully fetched.',
    type: GetAllTransactionsResponseDto,
  })
  async getAllTransactions(
    @Query() getAllTransactionsDto: GetAllTransactionsDto,
  ) {
    const { cursor, result, page, page_size } =
      await this.transactionService.getAllTransactions(getAllTransactionsDto);

    return new GetAllTransactionsResponseDto({
      cursor,
      page,
      pageSize: page_size,
      result: result.map((transaction) => {
        return new TransactionResponseDto({
          hash: transaction.hash,
          gas: transaction.gas,
          input: transaction.input,
          nonce: transaction.nonce,
          value: transaction.value,
          gasPrice: transaction.gas_price,
          blockHash: transaction.block_hash,
          toAddress: transaction.to_address,
          blockNumber: transaction.block_number,
          fromAddress: transaction.from_address,
          receiptRoot: transaction.receipt_root,
          receiptStatus: transaction.receipt_status,
          blockTimestamp: transaction.block_timestamp,
          receiptGasUsed: transaction.receipt_gas_used,
          toAddressLabel: transaction.to_address_label,
          fromAddressLabel: transaction.from_address_label,
          transactionIndex: transaction.transaction_index,
          receiptContractAddress: transaction.receipt_contract_address,
          receiptCumulativeGasUsed: transaction.receipt_cumulative_gas_used,
          transactionFee: transaction.transaction_fee,
        });
      }),
    });
  }
}
