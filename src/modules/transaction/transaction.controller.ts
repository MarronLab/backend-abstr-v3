import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
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
import { Request } from 'express';
import { ProfileData } from 'src/services/modulus/modulus.type';
import { UserService } from '../user/service/user.service';

@ApiBearerAuth()
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {}

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
    @Req() req: Request,
  ) {
    const modulusCustomerEmail: string = (req.user as ProfileData)?.firstName;

    if (!modulusCustomerEmail) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const internalUser =
      await this.userService.getInternalUserProfile(modulusCustomerEmail);
    if (!internalUser) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const { cursor, result, page, page_size } =
      await this.transactionService.getAllTransactions(
        internalUser.safeAddress,
        getAllTransactionsDto,
      );

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
          toAddressEntity: transaction.to_address_entity,
          toAddressEntityLogo: transaction.from_address_entity_logo,
          toAddress: transaction.to_address,
          toAddressLabel: transaction.to_address_label,
          blockNumber: transaction.block_number,
          fromAddressEntity: transaction.from_address_entity,
          fromAddressEntityLogo: transaction.from_address_entity_logo,
          fromAddress: transaction.from_address,
          fromAddressLabel: transaction.from_address_label,
          receiptRoot: transaction.receipt_root,
          receiptStatus: transaction.receipt_status,
          blockTimestamp: transaction.block_timestamp,
          receiptGasUsed: transaction.receipt_gas_used,
          transactionIndex: transaction.transaction_index,
          receiptContractAddress: transaction.receipt_contract_address,
          receiptCumulativeGasUsed: transaction.receipt_cumulative_gas_used,
          transactionFee: transaction.transaction_fee,
        });
      }),
    });
  }
}
