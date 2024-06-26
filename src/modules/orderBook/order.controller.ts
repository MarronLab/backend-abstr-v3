import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CancelOrderResponseDto, CreateOrderDto } from './dto/createOrder.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlaceOrderDto, PlaceOrderPricedDto } from './dto/placeOrder.dto';
import {
  PlaceOrderPricedResponseDto,
  PlaceOrderResponseDto,
} from './dto/placeOrderResponse.dto';
import { CancelOrderDto } from './dto/CancelOrder.dto';
import { OrderSideEnum } from 'src/services/modulus/modulus.enum';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseValidationInterceptor } from '../../common/response-validator.interceptor';
import {
  cancelOrderResponseSchema,
  orderHistoryResponseSchema,
  placeOrderPricedResponseSchema,
  placeOrderResponseSchema,
  tradeHistoryResponseSchema,
} from './order.schema';
import { OrderHistoryDto } from './dto/orderHistory.dto';
import {
  MatchedOrdersResponseDto,
  OrderHistoryResponseDto,
} from './dto/orderHistoryResponse.dto';
import { TradeHistoryDto } from './dto/tradeHistory.dto';
import { TradeHistoryResponseDto } from './dto/tradeHistoryResponse.dto';

@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(placeOrderResponseSchema))
  @Post('/place-order')
  async placeOrder(@Body() placeOrderDto: PlaceOrderDto) {
    const response = await this.orderService.placeOrder(placeOrderDto);

    return new PlaceOrderResponseDto({
      id: response.orderId,
      side: response.side === 'Buy' ? OrderSideEnum.BUY : OrderSideEnum.SELL,
      size: response.size,
      type: response.orderType,
      price: response.price,
      filled: response.filled,
      filledPrice: response.filledPrice,
      remaining: response.remaining,
      metadata: response.metadata,
    });
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(placeOrderPricedResponseSchema),
  )
  @Post('/place-order-priced')
  async placeOrderPriced(@Body() placeOrderPricedDto: PlaceOrderPricedDto) {
    const response =
      await this.orderService.placeOrderPriced(placeOrderPricedDto);

    return new PlaceOrderPricedResponseDto({
      id: response.orderId,
      side: response.side,
      size: response.size,
      type: response.orderType,
      price: response.price,
      filled: response.filled,
      filledPrice: response.filledPrice,
      remaining: response.remaining,
      metadata: response.metadata,
    });
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(cancelOrderResponseSchema))
  @Post('/cancel-order')
  async cancelOrder(@Body() cancelOrderDto: CancelOrderDto) {
    const response = await this.orderService.cancelOrder(cancelOrderDto);

    return new CancelOrderResponseDto({
      id: response.orderId,
      et: response.et,
      etm: response.etm,
    });
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(orderHistoryResponseSchema),
  )
  @Get('/order-history')
  async orderHistory(@Query() orderHistoryDto: OrderHistoryDto) {
    const response = await this.orderService.getOrderHistory(orderHistoryDto);

    const { pageInfo, rows } = response;

    const result = rows.map((row) => {
      const matcheOrders = row.mOrders.map(
        (mOrder) =>
          new MatchedOrdersResponseDto({
            side: mOrder.side,
            id: mOrder.orderId,
            date: mOrder.date,
            rate: mOrder.rate,
            trade: mOrder.trade,
            amount: mOrder.amount,
            market: mOrder.market,
            volume: mOrder.volume,
            serviceCharge: mOrder.serviceCharge,
          }),
      );

      return new OrderHistoryResponseDto({
        id: row.orderId,
        date: row.date,
        side: row.side,
        mOrders: matcheOrders,
        filled: row.filled,
        size: row.size,
        feePaid: row.feePaid,
        stopPrice: row.stopPrice,
        tradeType: row.tradeType,
        tradePrice: row.tradePrice,
        orderStatus: row.orderStatus,
        averagePrice: row.averagePrice,
        currencyPair: row.currencyPair,
        totalExecutedValue: row.totalExecutedValue,
      });
    });

    return { pageInfo, result };
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(tradeHistoryResponseSchema),
  )
  @Get('/trade-history')
  async tradeHistory(@Query() tradeHistoryDto: TradeHistoryDto) {
    const response = await this.orderService.getTradeHistory(tradeHistoryDto);

    const { pageInfo, rows } = response;

    const result = rows.map((row) => {
      return new TradeHistoryResponseDto({
        id: row.orderId,
        date: row.date,
        side: row.side,
        serviceCharge: row.serviceCharge,
        volume: row.volume,
        market: row.market,
        amount: row.amount,
        trade: row.trade,
        rate: row.rate,
      });
    });

    return { pageInfo, result };
  }
}
