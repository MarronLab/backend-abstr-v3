import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ApiTags } from '@nestjs/swagger';
import { PlaceOrderDto, PlaceOrderPricedDto } from './dto/placeOrder.dto';
import {
  PlaceOrderPricedResponseDto,
  PlaceOrderResponseDto,
} from './dto/placeOrderResponse.dto';
import { CancelOrderDto } from './dto/CancelOrder.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/place-order')
  async placeOrder(@Body() placeOrderDto: PlaceOrderDto) {
    const response = await this.orderService.placeOrder(placeOrderDto);

    return new PlaceOrderResponseDto({ id: response.orderId });
  }

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
    });
  }

  @Post('/cancel-order')
  async cancelOrder(@Body() cancelOrderDto: CancelOrderDto) {
    const response = await this.orderService.cancelOrder(cancelOrderDto);

    return response;
  }
}
