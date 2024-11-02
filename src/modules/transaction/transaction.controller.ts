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
    const userId: string = (req.user as ProfileData)?.internalData.id;

    if (!userId) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const internalUser = await this.userService.getInternalUserProfile(userId);
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
          type: transaction.type,
          blockTimestamp: transaction.block_timestamp,
          receiptStatus: transaction.receipt_status,
          tokenSymbol: transaction.token_symbol,
          direction: transaction.direction,
          value: transaction.value,
        });
      }),
    });
  }
}
