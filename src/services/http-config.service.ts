import { HttpService } from '@nestjs/axios';

export abstract class ModulusHttpService extends HttpService {}
export abstract class CoingeckoHttpService extends HttpService {}
export abstract class MoralisHttpService extends HttpService {}
