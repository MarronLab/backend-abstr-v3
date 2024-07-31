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
import { OrderHistoryDto } from './dto/orderHistory.dto';
import { TradeHistoryDto } from './dto/tradeHistory.dto';
import { AssetOpenOrderRequestDto } from './dto/openOrder.dto';

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
    // private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly modulusService: ModulusService,
    @Inject(REQUEST) req: Request,
  ) {
    super(prismaService, req);
  }

  async createOrder(createOrderDto: CreateOrderDto) {
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

      //@TODO: extract http call to it own service

      // const modulusOrderResponse = await this.httpService.axiosRef.post(
      //   '/SubmitOrder',
      //   {
      //     // CurrencyPair: 'FMAT_ETH',
      //     CurrencyPair: createOrderDto.CurrencyPair,
      //     Size: createOrderDto.Size,
      //     Remaining: createOrderDto.Size,
      //     Side: createOrderDto.Side,
      //     Type: 2,
      //     TimeInForce: 0,
      //     LimitPrice: createOrderDto.LimitPrice,
      //     StopPrice: 0,
      //     TrailingAmount: 0,
      //     OrderID: orderId,
      //     UserID: createOrderDto.UserID,
      //     ExtraData: JSON.parse(createOrderDto.ExtraData),
      //   },
      // );
      //
      // const data = modulusOrderResponse.data;
      //
      // console.log({ modulusOrderResponseData: data });
      // console.log({ modulusOrderResponseData: data?.Event?.NewTrades });
      //
      const orders: ReturnOrderI[] = [];
      // const { Event } = data || {};
      //
      // if (Event && Event.NewTrades.length > 0) {
      //   const { NewTrades, UpdatedBuyOrders, UpdatedSellOrders } = Event;
      //
      //   console.log({ NewTrades, UpdatedBuyOrders, UpdatedSellOrders });
      //
      //   for (const newTrade of NewTrades) {
      //     const relevantOrders = [...UpdatedBuyOrders, ...UpdatedSellOrders];
      //     const matchingOrder = relevantOrders.find(
      //       (order) => order.OrderID === newTrade.MakerOrderID,
      //     );
      //
      //     console.log({ extraData: matchingOrder.extraData });
      //
      //     if (matchingOrder) {
      //       orders.push({
      //         extraData: matchingOrder.extraData,
      //         size: newTrade.Size,
      //         price: newTrade.Price,
      //         timestamp: newTrade.Timestamp,
      //       });
      //     }
      //   }
      // }
      //
      return orders as any;
    } catch (error) {
      console.log(error);
    }
  }

  async getOrderHistory(orderHistoryDto: OrderHistoryDto) {
    try {
      const { data } = await this.modulusService.orderHistory({
        side: orderHistoryDto.side,
        pair: orderHistoryDto.pair,
        page: orderHistoryDto.page,
        count: orderHistoryDto.count,
      });

      return data.data;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async getTradeHistory(tradeHistoryDto: TradeHistoryDto) {
    try {
      const { data } = await this.modulusService.tradeHistory({
        side: tradeHistoryDto.side,
        pair: tradeHistoryDto.pair,
        page: tradeHistoryDto.page,
        count: tradeHistoryDto.count,
      });

      return data.data;
    } catch (error) {
      throw new UnprocessableEntityException(error);
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

  async getAssetOpenOrder(assetOpenOrderRequestDto: AssetOpenOrderRequestDto) {
    try {
      const { data } = await this.modulusService.getAssetOpenOrder({
        pair: assetOpenOrderRequestDto.pair,
        side: assetOpenOrderRequestDto.side,
        depth: assetOpenOrderRequestDto.depth,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.errorMessage);
      }

      const currencyPrice = await this.modulusService.getCurrencyPrice({
        pair: data.data.Pair,
      });

      return {
        assetOpenOrderData: data.data,
        currencyPrice: currencyPrice.data.data,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMarketSummary() {
    try {
      const { data } = await this.modulusService.getMarketSummary();
      return data.data;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
