import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ApiTags } from '@nestjs/swagger';
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
}
