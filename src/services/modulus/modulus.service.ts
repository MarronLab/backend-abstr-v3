import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  AuthenticateUserResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  PlaceOrderPricedRequest,
  PlaceOrderPricedResponse,
  PlaceOrderRequest,
  PlaceOrderResponse,
} from './modulus.type';

@Injectable()
export class ModulusService {
  constructor(private readonly httpService: HttpService) {}

  private async request<T>(endpoint: string, request: any) {
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

  async login(email: string, password: string) {
    return await this.request<AuthenticateUserResponse>(
      '/api/AuthenticateUser',
      {
        email,
        password,
      },
    );
  }

  async placeOrder(request: PlaceOrderRequest) {
    return await this.request<PlaceOrderResponse>('/api/PlaceOrder', request);
  }

  async placeOrderPriced(request: PlaceOrderPricedRequest) {
    return await this.request<PlaceOrderPricedResponse>(
      '/api/PlaceOrder_Priced',
      request,
    );
  }

  async cancelOrder(request: CancelOrderRequest) {
    return await this.request<CancelOrderResponse>('/api/CancelOrder', request);
  }
}
