import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  AuthenticateUserResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  GetBalanceResponse,
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

  async getBalance() {
    return await this.post<GetBalanceResponse>('/api/GetBalance');
  }
}
