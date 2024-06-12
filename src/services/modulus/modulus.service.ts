import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  CancelOrderRequest,
  PlaceOrderPricedRequest,
  PlaceOrderPricedResponse,
  PlaceOrderRequest,
  PlaceOrderResponse,
} from './modulus.type';

@Injectable()
export class ModulusService {
  private readonly config = {
    headers: {
      Authorization: `Bearer ${process.env.MODULUS_AUTH_TOKEN}`,
    },
  };

  constructor(private readonly httpService: HttpService) {}

  private async postOrder<T>(endpoint: string, request: any) {
    console.log(request);
    try {
      const response = await this.httpService.axiosRef.post<T>(
        endpoint,
        request,
      );

      return response;
    } catch (error) {
      throw new Error('Could not place an order');
    }
  }

  async placeOrder(request: PlaceOrderRequest) {
    console.log(request);
    return await this.postOrder<PlaceOrderResponse>('/PlaceOrder', request);
  }

  async placeOrderPriced(request: PlaceOrderPricedRequest) {
    console.log(request);
    return await this.postOrder<PlaceOrderPricedResponse>(
      '/PlaceOrder_Priced',
      request,
    );
  }

  async cancelOrder(request: CancelOrderRequest) {
    console.log(request);
    return await this.postOrder('/CancelOrder', request);
  }
}
