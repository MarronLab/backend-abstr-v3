import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
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
  placeOrderPricedResponseSchema,
  placeOrderResponseSchema,
} from './order.schema';

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
}
