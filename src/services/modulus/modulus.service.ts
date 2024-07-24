import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  AuthenticateUserResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  DeleteApiKeyRequest,
  DeleteApiKeyResponse,
  GenerateApiKeyRequest,
  GenerateApiKeyResponse,
  GetAllNotificationsRequest,
  GetAllNotificationsResponse,
  GetAllTransactionsRequest,
  GetAllTransactionsResponse,
  GetBalanceRequest,
  GetBalanceResponse,
  GetCoinStatsResponse,
  GetProfileResponse,
  ListApiKeysRequest,
  ListApiKeysResponse,
  NotificationsMarkReadResponse,
  OrderHistoryRequest,
  OrderHistoryResponse,
  PlaceOrderPricedRequest,
  PlaceOrderPricedResponse,
  PlaceOrderRequest,
  PlaceOrderResponse,
  TradeHistoryRequest,
  TradeHistoryResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyAccountRequest,
  VerifyAccountResponse,
  SignupResendEmailRequest,
  SignupResendEmailResponse,
  GAuthCheckStatusResponse,
  GAuthEnableRequestResponse,
  GAuthSetEnableRequest,
  GAuthSetEnableResponse,
  GAuthDisableRequestRequest,
  GAuthDisableRequestResponse,
  RequestChangePasswordOTPResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ChangeEmailRequest,
  ChangeEmailResponse,
  ChangeEmailVerifyOtpRequest,
  ChangeEmailVerifyOtpResponse,
  AssetOpenOrderRequest,
  AssetOpenOrderResponse,
  AssetCurrencyPriceRequest,
  AssetCurrencyPriceResponse,
  MarketSummaryResponse,
  TokenResponse,
  TokenRequest,
  ResendEmailOTPResponse,
  ValidateBearerTokenResponse,
  DeleteWhiteListedDevicesResponse,
} from './modulus.type';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class ModulusService {
  constructor(private readonly httpService: HttpService) {}

  private async post<T>(
    endpoint: string,
    request?: any,
    config?: AxiosRequestConfig,
  ) {
    try {
      const response = await this.httpService.axiosRef.post<T>(
        endpoint,
        request,
        config,
      );

      return response;
    } catch (error) {
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
      throw new Error(error);
    }
  }

  async login(email: string, password: string) {
    return await this.post<AuthenticateUserResponse>('/api/AuthenticateUser', {
      email,
      password,
    });
  }

  async register(request: RegisterRequest) {
    return await this.post<RegisterResponse>('/api/SignUp', request);
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

  async getProfile() {
    return await this.get<GetProfileResponse>('/api/GetProfile', {});
  }

  async generateApiKey(request: GenerateApiKeyRequest) {
    return await this.post<GenerateApiKeyResponse>(
      '/api/GenerateApiKey',
      request,
    );
  }

  async listApiKeys(request: ListApiKeysRequest) {
    return await this.post<ListApiKeysResponse>('/api/ListApiKey', request);
  }

  async deleteApiKey(request: DeleteApiKeyRequest) {
    return await this.post<DeleteApiKeyResponse>('/api/DeleteApiKey', request);
  }

  async verifyAccount(request: VerifyAccountRequest) {
    return await this.post<VerifyAccountResponse>(
      '/api/VerifyAccount',
      request,
    );
  }

  async signupResendEmail(request: SignupResendEmailRequest) {
    return await this.post<SignupResendEmailResponse>(
      '/api/SignUp_Resend_Email',
      request,
    );
  }

  async gAuthCheckStatus() {
    return await this.get<GAuthCheckStatusResponse>(
      '/api/GAuth_Check_Status',
      {},
    );
  }

  async gAuthEnableRequest() {
    return await this.get<GAuthEnableRequestResponse>(
      '/api/GAuth_Enable_Request',
      {},
    );
  }

  async gAuthSetEnable(request: GAuthSetEnableRequest) {
    return await this.post<GAuthSetEnableResponse>(
      '/api/GAuth_Set_Enable',
      request,
    );
  }

  async gAuthDisableRequest(request: GAuthDisableRequestRequest) {
    return await this.post<GAuthDisableRequestResponse>(
      '/api/GAuth_Disable_Request',
      request,
    );
  }

  async changePassword(request: ChangePasswordRequest) {
    return await this.post<ChangePasswordResponse>(
      '/api/ChangePassword',
      request,
    );
  }

  async requestChangePasswordOTP() {
    return await this.post<RequestChangePasswordOTPResponse>(
      '/api/RequestChangePasswordOTP',
    );
  }

  async changeEmail(request: ChangeEmailRequest) {
    return await this.post<ChangeEmailResponse>('/api/Change_Email', request);
  }

  async changeEmailVerifyOtp(request: ChangeEmailVerifyOtpRequest) {
    return await this.post<ChangeEmailVerifyOtpResponse>(
      '/api/ChangeEmail_Verify_EmailOTP',
      request,
    );
  }

  async getAssetOpenOrder(request: AssetOpenOrderRequest) {
    return await this.get<AssetOpenOrderResponse>(
      `/market/get-open-orders/${request.pair}/${request.side}/${request.depth}`,
      {},
    );
  }

  async getCurrencyPrice(request: AssetCurrencyPriceRequest) {
    return await this.get<AssetCurrencyPriceResponse>(
      `/market/get-currency-price/${request.pair}`,
      {},
    );
  }

  async getMarketSummary() {
    return await this.get<MarketSummaryResponse>(
      '/market/get-market-summary',
      {},
    );
  }

  async token(request: TokenRequest) {
    const data = Object.keys(request)
      .map((key) => `${key}=${encodeURIComponent((request as any)[key])}`)
      .join('&');

    return await this.post<TokenResponse>('/token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });
  }

  async resentEmailOTP(token: string) {
    return await this.post<ResendEmailOTPResponse>(
      `/api/AuthenticateUser_Resend_EmailOTP/${token}`,
    );
  }

  async validateBearerToken() {
    return await this.post<ValidateBearerTokenResponse>(
      `/Validate_BearerToken`,
    );
  }

  async deleteWhitelistedDevices(id: number) {
    return await this.post<DeleteWhiteListedDevicesResponse>(
      '/api/delete-whitelisted-device',
      id,
    );
  }
}
