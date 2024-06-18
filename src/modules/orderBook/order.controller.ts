import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlaceOrderDto, PlaceOrderPricedDto } from './dto/placeOrder.dto';
import {
  PlaceOrderPricedResponseDto,
  PlaceOrderResponseDto,
} from './dto/placeOrderResponse.dto';
import { CancelOrderDto } from './dto/CancelOrder.dto';
import { OrderSideEnum } from 'src/services/modulus/modulus.enum';
import { AuthGuard } from '../auth/auth.guard';
import { OrderValidationPipe } from '../../schema/order/order.validation';
import { OrderTransformInterceptor } from 'src/schema/order/order.transformers';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-order')
  @UsePipes(OrderValidationPipe)
  @UseInterceptors(new OrderTransformInterceptor(CreateOrderDto))
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
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
  @Post('/place-order-priced')
  async placeOrderPriced(@Body() placeOrderPricedDto: PlaceOrderPricedDto) {
    const response =
      await this.orderService.placeOrderPriced(placeOrderPricedDto);

    return new PlaceOrderPricedResponseDto({
      id: response.orderId,
      ooc: response.ooc,
      side: response.side,
      size: response.size,
      type: response.orderType,
      price: response.price,
      filled: response.filled,
      filledPrice: response.filledPrice,
      status: response.orderStatus,
      remaining: response.remaining,
      metadata: response.metadata,
    });
  }

  @UseGuards(AuthGuard)
  @Post('/cancel-order')
  async cancelOrder(@Body() cancelOrderDto: CancelOrderDto) {
    const response = await this.orderService.cancelOrder(cancelOrderDto);

    return response;
  }
}
