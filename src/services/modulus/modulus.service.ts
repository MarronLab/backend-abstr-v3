import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  AuthenticateUserResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  GetAllNotificationsRequest,
  GetAllNotificationsResponse,
  GetAllTransactionsRequest,
  GetAllTransactionsResponse,
  GetBalanceRequest,
  GetBalanceResponse,
  GetCoinStatsResponse,
  NotificationsMarkReadResponse,
  OrderHistoryRequest,
  OrderHistoryResponse,
  PlaceOrderPricedRequest,
  PlaceOrderPricedResponse,
  PlaceOrderRequest,
  PlaceOrderResponse,
  TradeHistoryRequest,
  TradeHistoryResponse,
} from './modulus.type';

@Injectable()
export class ModulusService {
  constructor(private readonly httpService: HttpService) {}

  private async post<T>(endpoint: string, request?: any) {
    try {
      const response = await this.httpService.axiosRef.post<T>(
        endpoint,
        request,
      );

      return response;
    } catch (error) {
      console.log('Error: ', error);
      throw new Error(error);
    }
  }

  private async get<T>(endpoint: string, params: any) {
    try {
      const response = await this.httpService.axiosRef.get<T>(endpoint, {
        params,
      });

      return response;
    } catch (error) {
      console.log('Error: ', error);
      throw new Error(error);
    }
  }

  async login(email: string, password: string) {
    return await this.post<AuthenticateUserResponse>('/api/AuthenticateUser', {
      email,
      password,
    });
  }

  async placeOrder(request: PlaceOrderRequest) {
    return await this.post<PlaceOrderResponse>('/api/PlaceOrder', request);
  }

  async placeOrderPriced(request: PlaceOrderPricedRequest) {
    return await this.post<PlaceOrderPricedResponse>(
      '/api/PlaceOrder_Priced',
      request,
    );
  }

  async cancelOrder(request: CancelOrderRequest) {
    return await this.post<CancelOrderResponse>('/api/CancelOrder', request);
  }

  async tradeHistory(request: TradeHistoryRequest) {
    return await this.get<TradeHistoryResponse>('/api/TradeHistory', request);
  }

  async orderHistory(request: OrderHistoryRequest) {
    return await this.get<OrderHistoryResponse>('/api/OrderHistory', request);
  }

  async getBalance(request: GetBalanceRequest = { currency: 'ALL' }) {
    return await this.post<GetBalanceResponse>('/api/GetBalance', request);
  }

  async getCoinStats() {
    return await this.post<GetCoinStatsResponse>('/api/get_coin_stats');
  }

  async getAllTransactions(
    request: GetAllTransactionsRequest = { page: 1, count: 100 },
  ) {
    return await this.get<GetAllTransactionsResponse>(
      '/api/Get_All_Transactions',
      request,
    );
  }

  async getAllNotifications(
    request: GetAllNotificationsRequest = { page: 1, count: 100 },
  ) {
    return await this.get<GetAllNotificationsResponse>(
      '/notification/get-notification/all',
      request,
    );
  }

  async notificationsMarkRead(id: number) {
    return await this.post<NotificationsMarkReadResponse>(
      `/notification/mark-read/${id}`,
    );
  }
}
