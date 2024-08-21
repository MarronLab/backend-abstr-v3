import {
  Injectable,
  UnprocessableEntityException,
  Inject,
  Scope,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { PrismaService } from 'src/services/prisma.service';
import { PlaceOrderDto, PlaceOrderPricedDto } from './dto/placeOrder.dto';
import { ModulusService } from 'src/services/modulus/modulus.service';
import { CancelOrderDto } from './dto/CancelOrder.dto';
import { BaseService } from 'src/common/base.service';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { OrderHistoryDto } from './dto/orderHistory.dto';
import { OrderResponseDto } from './dto/orderHistoryResponse.dto';
import { TradeHistoryDto } from './dto/tradeHistory.dto';
import { AssetOpenOrderRequestDto } from './dto/openOrder.dto';
import { PendingOrdersDto } from './dto/pendingOrders.dto';
import axios from 'axios';
import { GetChartDataQueryDto } from './dto/ChartData.dto';
import {
  OrderStatusType as OrderStatusTypePrisma,
  OrderType as OrderTypePrisma,
  SideType as SideTypePrisma,
  TimeInForceType as TimeInForceTypePrisma,
} from '@prisma/client';
import {
  SubmitOrderResponse,
  OrderStatusType,
  OrdersI,
  OrderType,
  TimeInForceType,
  SideType,
} from './interfaces/submitOrder.interface';
import { ProfileData } from 'src/services/modulus/modulus.type';
import {
  OrderSideEnum,
  OrderTypeEnum,
} from 'src/services/modulus/modulus.enum';
import { calculateSkip } from 'src/utils/pagination';

interface ReturnOrderI {
  extraData: any;
  size: number;
  price: number;
  timestamp: string;
}

@Injectable({ scope: Scope.REQUEST })
export class OrderService extends BaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly modulusService: ModulusService,
    @Inject(REQUEST) req: Request,
  ) {
    super(prismaService, req);
  }

  private convertOrderStatusToPrismaEnum(
    status: OrderStatusType,
  ): OrderStatusTypePrisma {
    switch (status) {
      case OrderStatusType.ORDER_STATUS_NONE:
        return OrderStatusTypePrisma.ORDER_STATUS_NONE;
      case OrderStatusType.ORDER_STATUS_ACCEPTED:
        return OrderStatusTypePrisma.ORDER_STATUS_ACCEPTED;
      case OrderStatusType.ORDER_STATUS_PARTIALLY_FILLED:
        return OrderStatusTypePrisma.ORDER_STATUS_PARTIALLY_FILLED;
      case OrderStatusType.ORDER_STATUS_FILLED:
        return OrderStatusTypePrisma.ORDER_STATUS_FILLED;
      case OrderStatusType.ORDER_STATUS_CANCELLED:
        return OrderStatusTypePrisma.ORDER_STATUS_CANCELLED;
      case OrderStatusType.ORDER_STATUS_REJECTED:
        return OrderStatusTypePrisma.ORDER_STATUS_REJECTED;
      case OrderStatusType.ORDER_STATUS_EXPIRED:
        return OrderStatusTypePrisma.ORDER_STATUS_EXPIRED;
      case OrderStatusType.ORDER_STATUS_ORDER_STATUS_END:
        return OrderStatusTypePrisma.ORDER_STATUS_ORDER_STATUS_END;
      case OrderStatusType.ORDER_STATUS_CANCEL_ACCEPTED:
        return OrderStatusTypePrisma.ORDER_STATUS_CANCEL_ACCEPTED;
      case OrderStatusType.ORDER_STATUS_CANCEL_REJECTED:
        return OrderStatusTypePrisma.ORDER_STATUS_CANCEL_REJECTED;
      case OrderStatusType.ORDER_STATUS_STOP_ACTIVATED:
        return OrderStatusTypePrisma.ORDER_STATUS_STOP_ACTIVATED;
      default:
        throw new Error(`Unknown order status: ${status}`);
    }
  }

  private convertOrderTypeToPrismaEnum(type: OrderType): OrderTypePrisma {
    switch (type) {
      case OrderType.ORDER_TYPE_NONE:
        return OrderTypePrisma.ORDER_TYPE_NONE;
      case OrderType.ORDER_TYPE_MARKET:
        return OrderTypePrisma.ORDER_TYPE_MARKET;
      case OrderType.ORDER_TYPE_LIMIT:
        return OrderTypePrisma.ORDER_TYPE_LIMIT;
      case OrderType.ORDER_TYPE_STOP_MARKET:
        return OrderTypePrisma.ORDER_TYPE_STOP_MARKET;
      case OrderType.ORDER_TYPE_STOP_LIMIT:
        return OrderTypePrisma.ORDER_TYPE_STOP_LIMIT;
      case OrderType.ORDER_TYPE_TRAILING_STOP_LIMIT:
        return OrderTypePrisma.ORDER_TYPE_TRAILING_STOP_LIMIT;
      case OrderType.ORDER_TYPE_TRAILING_STOP_LIMIT:
        return OrderTypePrisma.ORDER_TYPE_TRAILING_STOP_MARKET;
      default:
        throw new Error(`Unknown order status: ${status}`);
    }
  }

  private convertSideTypeToPrismaEnum(side: SideType): SideTypePrisma {
    switch (side) {
      case SideType.SIDE_NONE:
        return SideTypePrisma.SIDE_NONE;
      case SideType.SIDE_BUY:
        return SideTypePrisma.SIDE_BUY;
      case SideType.SIDE_SELL:
        return SideTypePrisma.SIDE_SELL;
      default:
        throw new Error(`Unknown order status: ${status}`);
    }
  }

  private convertTimeInForceToPrismaEnum(
    timeInForce: TimeInForceType,
  ): TimeInForceTypePrisma {
    switch (timeInForce) {
      case TimeInForceType.TIF_NONE:
        return TimeInForceTypePrisma.TIF_NONE;
      case TimeInForceType.TIF_FOK:
        return TimeInForceTypePrisma.TIF_FOK;
      case TimeInForceType.TIF_GTC:
        return TimeInForceTypePrisma.TIF_GTC;
      case TimeInForceType.TIF_DAY:
        return TimeInForceTypePrisma.TIF_DAY;
      case TimeInForceType.TIF_IOC:
        return TimeInForceTypePrisma.TIF_IOC;
      default:
        throw new Error(`Unknown order status: ${status}`);
    }
  }

  private convertSideToEnum(side: string): OrderSideEnum | undefined {
    let result: OrderSideEnum | undefined;

    switch (side) {
      case 'SIDE_BUY':
        result = OrderSideEnum.BUY;
        break;
      case 'SIDE_SELL':
        result = OrderSideEnum.SELL;
        break;
      default:
        result = undefined;
    }

    return result;
  }

  private convertOrderTypeToEnum(type: string): OrderTypeEnum | undefined {
    switch (type) {
      case 'ORDER_TYPE_LIMIT':
        return OrderTypeEnum.LIMIT;
      case 'ORDER_TYPE_MARKET':
        return OrderTypeEnum.MARKET;
      default:
        return undefined;
    }
  }

  private convertOrderStatusToEnum(
    statusType: string,
  ): 'Filled' | 'Cancelled' | 'Pending' | undefined {
    switch (statusType) {
      case 'ORDER_STATUS_FILLED':
        return 'Filled';
      case 'ORDER_STATUS_CANCELLED':
        return 'Cancelled';
      case 'ORDER_STATUS_ACCEPTED':
        return 'Pending';
      default:
        return undefined;
    }
  }

  private convertStringToSideType(
    side: string | undefined,
  ): SideTypePrisma | undefined {
    if (!side) return undefined;

    switch (side) {
      case 'BUY':
        return SideTypePrisma.SIDE_BUY;
      case 'SELL':
        return SideTypePrisma.SIDE_SELL;
      case 'ALL':
        return undefined;
      default:
        throw new Error(`Invalid side type: ${side}`);
    }
  }

  private createOrderFilter(
    pair: string,
    sideEnum: SideTypePrisma | undefined,
  ) {
    return {
      currencyPair: pair !== 'ALL' ? pair : undefined,
      side: sideEnum,
    };
  }

  private filterDuplicates<T extends object>(array: T[], key: keyof T): T[] {
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

  async createOrder(createOrderDto: CreateOrderDto, user: ProfileData) {
    try {
      const orderId = Math.floor(Date.now() / 1000);
      const params = {
        CurrencyPair: createOrderDto.CurrencyPair,
        Size: createOrderDto.Size,
        Remaining: 1,
        Side: createOrderDto.Side,
        Type: OrderType.ORDER_TYPE_LIMIT,
        TimeInForce: TimeInForceType.TIF_NONE,
        LimitPrice: createOrderDto.LimitPrice,
        StopPrice: 0,
        TrailingAmount: 0,
        OrderID: orderId,
        UserID: user.customerID,
        ExtraData: JSON.parse(createOrderDto.ExtraData),
      };

      console.log({ params });
      console.log({ ExtraData: params.ExtraData });

      //@TODO: extract http call to it own service
      const modulusOrderResponse = await axios.post<SubmitOrderResponse>(
        `${process.env.MODULUS_GME_URL}/SubmitOrder`,
        params,
      );

      const data = modulusOrderResponse.data;

      console.log({ data });
      console.log({ UpdatedBuyOrders: data?.Event?.UpdatedBuyOrders });
      console.log({ UpdatedSellOrders: data?.Event?.UpdatedSellOrders });
      console.log({ NewTrades: data?.Event?.NewTrades });

      if (data.ErrorReason !== 100) {
        throw new UnprocessableEntityException(data.ErrorReason);
      }

      await this.getClient().orderBook.create({
        data: {
          orderID: params.OrderID,
          metadata: params.ExtraData,
          timeInForce: this.convertTimeInForceToPrismaEnum(params.TimeInForce),
          modulusCustomerEmail: user.internalData.modulusCustomerEmail,
          trailingAmount: params.TrailingAmount,
          size: params.Size,
          limitPrice: params.LimitPrice,
          stopPrice: params.StopPrice,
          remaining: params.Remaining,
          currencyPair: params.CurrencyPair,
          side: this.convertSideTypeToPrismaEnum(params.Side),
          statusType: this.convertOrderStatusToPrismaEnum(data.RequestStatus),
          type: this.convertOrderTypeToPrismaEnum(params.Type),
        },
      });

      const orders: ReturnOrderI[] = [];
      let matchingOrders: OrdersI[] = [];

      const { Event } = data || {};

      if (Event && Event.NewTrades.length > 0) {
        const { NewTrades, UpdatedBuyOrders, UpdatedSellOrders } = Event;

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

  async getOrderHistory(orderHistoryDto: OrderHistoryDto, user: ProfileData) {
    const { pair, side, page = 1, count = 10 } = orderHistoryDto;
    const skip = calculateSkip(page, count);
    const sideEnum = this.convertStringToSideType(side);

    const filterCriteria: Record<string, any> = {
      ...this.createOrderFilter(pair, sideEnum),
      modulusCustomerEmail: user.internalData.modulusCustomerEmail,
    };

    try {
      const orders = await this.getClient().orderBook.findMany({
        where: filterCriteria,
        skip,
        take: count,
      });

      const totalRows = await this.getClient().orderBook.count({
        where: filterCriteria,
      });

      const ZERO = '0';

      const orderDtos = orders.map(
        (order) =>
          new OrderResponseDto({
            id: order.orderID,
            date: order.createdAt.toISOString(),
            currencyPair: order.currencyPair,
            side: this.convertSideToEnum(order.side),
            tradeType: this.convertOrderTypeToEnum(order.type),
            tradePrice: order.limitPrice.toString(),
            averagePrice: ZERO,
            size: order.size.toString(),
            filled: order.remaining.toString(),
            feePaid: ZERO,
            totalExecutedValue: order.size.toString(),
            stopPrice: order.stopPrice.toString(),
            orderStatus: this.convertOrderStatusToEnum(order.statusType),
            mOrders: [],
          }),
      );
      return { orders: orderDtos, totalRows };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch order history');
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
      console.log(error);
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
      // await this.getClient().orderBook.create({
      //   data: {
      //     orderId: String(data.data.orderId),
      //     metadata: placeOrderDto.metadata,
      //   },
      // });

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
      // await this.getClient().orderBook.create({
      //   data: {
      //     orderId: String(data.data.orderId),
      //     metadata: placeOrderPricedDto.metadata,
      //   },
      // });

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
      // await this.getClient().orderBook.delete({
      //   where: { orderId: String(cancelOrderDto.id) },
      // });

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

  async getPendingOrders(pendingOrdersDto: PendingOrdersDto) {
    try {
      const { data } = await this.modulusService.getPendingOrders({
        pair: pendingOrdersDto.pair,
        side: pendingOrdersDto.side,
      });

      if (data.status === 'Error') {
        throw new UnprocessableEntityException(data.message);
      }

      return data.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getChartData(queryParams: GetChartDataQueryDto) {
    try {
      const response = await this.modulusService.getChartData(queryParams);

      if (response.data.status === 'Error') {
        throw new UnprocessableEntityException();
      }

      return response.data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
