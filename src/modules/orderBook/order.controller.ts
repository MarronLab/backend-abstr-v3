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
import {
  CancelOrderResponseDto,
  CreateOrderDto,
  CreateOrderResponseDto,
} from './dto/createOrder.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
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
  assetOpenOrderResponseSchema,
  marketSummaryResponseSchema,
} from './order.schema';
import { OrderHistoryDto } from './dto/orderHistory.dto';
import {
  MatchedOrderResponseDto,
  OrderHistoryResponseDto,
  OrderResponseDto,
} from './dto/orderHistoryResponse.dto';
import { TradeHistoryDto } from './dto/tradeHistory.dto';
import {
  TradeHistoryResponseDto,
  TradeResponseDto,
} from './dto/tradeHistoryResponse.dto';
import { AssetOpenOrderRequestDto } from './dto/openOrder.dto';
import {
  AssetOpenOrderResponseDto,
  OpenOrderDataDto,
  AssetOpenOrderDataDto,
} from './dto/openOrderResponse.dto';
import { MarketSummaryDtoResponse } from './dto/marketSummary.dto';

@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-order')
  @ApiOperation({ summary: 'Create order' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiCreatedResponse({
    description: 'The order has been successfully created.',
    type: [CreateOrderResponseDto],
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const response = await this.orderService.createOrder(createOrderDto);

    return response.map((order: any) => {
      return new CreateOrderResponseDto({
        size: order.size,
        price: order.price,
        extraData: order.extraData,
        timestamp: order.timestamp,
      });
    });
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(placeOrderResponseSchema))
  @Post('/place-order')
  @ApiOperation({ summary: 'Place order' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiCreatedResponse({
    description: 'The order has been successfully created.',
    type: PlaceOrderResponseDto,
  })
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
  @ApiOperation({ summary: 'Place order priced' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiCreatedResponse({
    description: 'The order has been successfully created.',
    type: PlaceOrderPricedResponseDto,
  })
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
  @ApiOperation({ summary: 'Cancel order' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiCreatedResponse({
    description: 'The order has been successfully cancelled.',
    type: CancelOrderResponseDto,
  })
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
  @ApiOperation({ summary: 'Fetch order history' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiCreatedResponse({
    description: 'The order history has been successfully fetched.',
    type: OrderHistoryResponseDto,
  })
  async orderHistory(@Query() orderHistoryDto: OrderHistoryDto) {
    const response = await this.orderService.getOrderHistory(orderHistoryDto);

    const { pageInfo, rows } = response;

    const result = rows.map((row) => {
      const matcheOrders = row.mOrders.map(
        (mOrder) =>
          new MatchedOrderResponseDto({
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

      return new OrderResponseDto({
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

    return new OrderHistoryResponseDto({ pageInfo, result });
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(tradeHistoryResponseSchema),
  )
  @Get('/trade-history')
  @ApiOperation({ summary: 'Fetch trade history' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiCreatedResponse({
    description: 'The trade history has been successfully fetched.',
    type: TradeHistoryResponseDto,
  })
  async tradeHistory(@Query() tradeHistoryDto: TradeHistoryDto) {
    const response = await this.orderService.getTradeHistory(tradeHistoryDto);

    const { pageInfo, rows } = response;

    const result = rows.map((row) => {
      return new TradeResponseDto({
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

    return new TradeHistoryResponseDto({ pageInfo, result });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(assetOpenOrderResponseSchema),
  )
  @Get('/get-open-orders')
  @ApiOperation({ summary: 'Fetch asset open order' })
  @ApiCreatedResponse({
    description: 'The asset open order history has been successfully fetched.',
    type: AssetOpenOrderResponseDto,
  })
  async OpenOrders(
    @Query() assetOpenOrderRequestDto: AssetOpenOrderRequestDto,
  ) {
    const response = await this.orderService.getAssetOpenOrder(
      assetOpenOrderRequestDto,
    );

    const { currencyPrice, assetOpenOrderData } = response;
    const transformedOrders: OpenOrderDataDto[] = assetOpenOrderData.Orders.map(
      (order) => ({
        MarketType: order.MarketType,
        CurrencyType: order.CurrencyType,
        Rate: order.Rate,
        Volume: order.Volume,
        Total: order.Rate * order.Volume,
      }),
    );

    const transformedData: AssetOpenOrderDataDto = {
      Pair: assetOpenOrderData.Pair,
      Type: assetOpenOrderData.Type,
      Orders: transformedOrders,
    };

    return new AssetOpenOrderResponseDto({
      data: transformedData,
      currencyPrice: currencyPrice.Price,
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(marketSummaryResponseSchema),
  )
  @Get('get-market-summary')
  @ApiOperation({
    summary: 'This endpoint returns a summary of all listed currency pairs',
  })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiCreatedResponse({
    description: 'The market summary has successfully been fetched.',
    type: MarketSummaryDtoResponse,
  })
  async getMarketSummary() {
    const response = await this.orderService.getMarketSummary();
    const dtoResponse: MarketSummaryDtoResponse = {};

    Object.keys(response).forEach((pair) => {
      dtoResponse[pair] = {
        Last: response[pair].Last,
        LowestAsk: response[pair].LowestAsk,
        HeighestBid: response[pair].HeighestBid,
        PercentChange: response[pair].PercentChange,
        BaseVolume: response[pair].BaseVolume,
        QuoteVolume: response[pair].QuoteVolume,
        High_24hr: response[pair].High_24hr,
        Low_24hr: response[pair].Low_24hr,
      };
    });

    return dtoResponse;
  }
}
