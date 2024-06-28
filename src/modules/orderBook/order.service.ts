import {
  Injectable,
  UnprocessableEntityException,
  Inject,
  Scope,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Order } from 'hft-limit-order-book/dist/types/order';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/services/prisma.service';
import { PlaceOrderDto, PlaceOrderPricedDto } from './dto/placeOrder.dto';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { CancelOrderDto } from './dto/CancelOrder.dto';
import { BaseService } from 'src/common/base.service';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

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

@Injectable({ scope: Scope.REQUEST })
export class OrderService extends BaseService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly modulusService: ModulusService,
    @Inject(REQUEST) req: Request,
  ) {
    super(prismaService, req);
  }

  filterDuplicates<T extends object>(array: T[], key: keyof T): T[] {
    const seen = new Set<T[keyof T]>();
    return array.reduce<T[]>((acc, item) => {
      const keyValue = item[key];
      if (keyValue !== undefined && !seen.has(keyValue)) {
        seen.add(keyValue);
        acc.push(item);
      }
      return acc;
    }, []);
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    console.log({ createOrderDto });
    try {
      const orderId = Math.floor(Date.now() / 1000);

      console.log({
        CurrencyPair: 'BTC_ETH',
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
      let matchingOrders: any[] = [];
      const { Event } = data || {};

      if (Event && Event.NewTrades.length > 0) {
        const { NewTrades, UpdatedBuyOrders, UpdatedSellOrders } = Event;

        console.log({ NewTrades, UpdatedBuyOrders, UpdatedSellOrders });

        for (const newTrade of NewTrades) {
          const relevantOrders = [...UpdatedBuyOrders, ...UpdatedSellOrders];
          matchingOrders = relevantOrders.filter(
            (order) =>
              order.OrderID === newTrade.MakerOrderID ||
              order.OrderID === newTrade.TakerOrderID,
          );
        }
      }

      const uniqueMatchingOrders = this.filterDuplicates(
        matchingOrders,
        'OrderID',
      );

      for (const matchingOrder of uniqueMatchingOrders) {
        if (matchingOrder) {
          orders.push({
            extraData: matchingOrder.extraData,
            size: matchingOrder.Size,
            price: matchingOrder.LimitPrice,
            timestamp: matchingOrder.TimeModified,
          });
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
      );

      if (modulusOrderResponse.data.status === 'Error') {
        return modulusOrderResponse.data;
      }

      console.log(modulusOrderResponse.data);

      const promise = Promise.all(
        modulusOrderResponse.data.data.rows.map(async (modulusOrder: any) => {
          const storedOrder = await this.getClient().orderBook.findFirst({
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

  async placeOrder(placeOrderDto: PlaceOrderDto) {
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

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      //Store metadata
      await this.getClient().orderBook.create({
        data: {
          orderId: String(data.data.orderId),
          metadata: placeOrderDto.metadata,
        },
      });

      return { ...data.data, metadata: placeOrderDto.metadata };
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async placeOrderPriced(placeOrderPricedDto: PlaceOrderPricedDto) {
    try {
      const { data } = await this.modulusService.placeOrderPriced({
        side: placeOrderPricedDto.side,
        market: placeOrderPricedDto.market,
        trade: placeOrderPricedDto.trade,
        amount: placeOrderPricedDto.amount,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      //Store metadata
      await this.getClient().orderBook.create({
        data: {
          orderId: String(data.data.orderId),
          metadata: placeOrderPricedDto.metadata,
        },
      });

      return { ...data.data, metadata: placeOrderPricedDto.metadata };
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async cancelOrder(cancelOrderDto: CancelOrderDto) {
    try {
      const { data } = await this.modulusService.cancelOrder({
        orderId: cancelOrderDto.id,
        side: cancelOrderDto.side,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.data);
      }

      //Remove metadata
      await this.getClient().orderBook.delete({
        where: { orderId: String(cancelOrderDto.id) },
      });

      return data.data;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
