import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Order } from 'hft-limit-order-book/dist/types/order';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/services/prisma.service';
import { PlaceOrderDto, PlaceOrderPricedDto } from './dto/placeOrder.dto';
import { ModulusService } from 'src/services/modulus/modulus.service';
import {
  PlaceOrderPricedResponse,
  PlaceOrderPricedResponseData,
  PlaceOrderResponse,
  PlaceOrderResponseData,
} from 'src/services/modulus/modulus.type';

export interface IProcessOrder {
  done: Order[];
  partial: Order | null;
  partialQuantityProcessed: number;
  quantityLeft: number;
  err: Error | null;
}

interface ReturnOrderI {
  extraData: any;
  size: number;
  price: number;
  timestamp: string;
}

@Injectable()
export class OrderService {
  private readonly config = {
    headers: {
      Authorization: `Bearer ${process.env.MODULUS_AUTH_TOKEN}`,
    },
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly modulusService: ModulusService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    // console.log(createOrderDto);
    try {
      const orderId = Math.floor(Date.now() / 1000);

      console.log({
        CurrencyPair: createOrderDto.CurrencyPair,
        Size: createOrderDto.Size,
        Remaining: createOrderDto.Size,
        Side: createOrderDto.Side,
        Type: 2,
        TimeInForce: 0,
        LimitPrice: createOrderDto.LimitPrice,
        StopPrice: 0,
        TrailingAmount: 0,
        OrderID: orderId,
        UserID: createOrderDto.UserID,
        // ExtraData: JSON.parse(createOrderDto.ExtraData),
      });

      const modulusOrderResponse = await this.httpService.axiosRef.post(
        '/SubmitOrder',
        {
          // CurrencyPair: 'FMAT_ETH',
          CurrencyPair: createOrderDto.CurrencyPair,
          Size: createOrderDto.Size,
          Remaining: createOrderDto.Size,
          Side: createOrderDto.Side,
          Type: 2,
          TimeInForce: 0,
          LimitPrice: createOrderDto.LimitPrice,
          StopPrice: 0,
          TrailingAmount: 0,
          OrderID: orderId,
          UserID: createOrderDto.UserID,
          ExtraData: JSON.parse(createOrderDto.ExtraData),
        },
      );

      const data = modulusOrderResponse.data;

      console.log({ modulusOrderResponseData: data });
      console.log({ modulusOrderResponseData: data?.Event?.NewTrades });

      const orders: ReturnOrderI[] = [];
      const { Event } = data || {};

      if (Event && Event.NewTrades.length > 0) {
        const { NewTrades, UpdatedBuyOrders, UpdatedSellOrders } = Event;

        console.log({ NewTrades, UpdatedBuyOrders, UpdatedSellOrders });

        for (const newTrade of NewTrades) {
          const relevantOrders = [...UpdatedBuyOrders, ...UpdatedSellOrders];
          const matchingOrder = relevantOrders.find(
            (order) => order.OrderID === newTrade.MakerOrderID,
          );

          console.log({ extraData: matchingOrder.extraData });

          if (matchingOrder) {
            orders.push({
              extraData: matchingOrder.extraData,
              size: newTrade.Size,
              price: newTrade.Price,
              timestamp: newTrade.Timestamp,
            });
          }
        }
      }

      return orders as any;
    } catch (error) {
      console.log(error);
    }
  }

  async getOrder() {
    try {
      const modulusOrderResponse = await this.httpService.axiosRef.get(
        '/api/OrderHistory?side=ALL&pair=ALL',
        this.config,
      );

      if (modulusOrderResponse.data.status === 'Error') {
        return modulusOrderResponse.data;
      }

      console.log(modulusOrderResponse.data);

      const promise = Promise.all(
        modulusOrderResponse.data.data.rows.map(async (modulusOrder: any) => {
          const storedOrder = await this.prismaService.orderBook.findFirst({
            where: { orderId: modulusOrder.orderId },
          });

          return { modulusOrder, storedOrder };
        }),
      );

      const response = await promise;

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async placeOrder(
    placeOrderDto: PlaceOrderDto,
  ): Promise<PlaceOrderResponseData> {
    console.log(placeOrderDto);
    try {
      const { data } = await this.modulusService.placeOrder({
        side: placeOrderDto.side,
        market: placeOrderDto.market,
        trade: placeOrderDto.trade,
        volume: placeOrderDto.volume,
        rate: placeOrderDto.rate,
        timeInForce: placeOrderDto.timeInForce,
        clientOrderId: placeOrderDto.clientOrderId,
        stop: placeOrderDto.stop,
        type: placeOrderDto.type,
      });

      if (!data.data) {
        throw new UnprocessableEntityException('Could not place an order');
      }

      return data.data;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async placeOrderPriced(
    placeOrderPricedDto: PlaceOrderPricedDto,
  ): Promise<PlaceOrderPricedResponseData> {
    console.log(placeOrderPricedDto);
    try {
      const { data } = await this.modulusService.placeOrderPriced({
        side: placeOrderPricedDto.side,
        market: placeOrderPricedDto.market,
        trade: placeOrderPricedDto.trade,
        amount: placeOrderPricedDto.amount,
      });

      if (!data.data) {
        throw new UnprocessableEntityException('Could not place an order');
      }

      return data.data;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
