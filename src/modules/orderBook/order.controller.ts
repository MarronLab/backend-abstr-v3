import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }
}
