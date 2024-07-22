import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class JsonParseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    bodyParser.json()(req, res, (err) => {
      if (err) {
        next(new BadRequestException(`Invalid JSON format: ${err.message}`));
      } else {
        next();
      }
    });
  }
}
