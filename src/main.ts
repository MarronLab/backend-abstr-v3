import * as Sentry from '@sentry/node';
import {
  BaseExceptionFilter,
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserActivityInterceptor } from './common/user-activity.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { TransactionInterceptor } from './common/transaction.interceptor';
import { PrismaService } from './services/prisma.service';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { JsonParseMiddleware } from './utils/JsonParseMiddleware';

async function bootstrap() {
  Sentry.init({
    environment:
      process.env.NODE_ENV === 'production' ? 'production' : 'development',
    dsn: process.env.SENTRY_DNS,
  });

  const app = await NestFactory.create(AppModule, { cors: true });

  // app.enableCors({
  //   origin: false,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Specify the HTTP methods you want to allow
  //   // allowedHeaders: ['Content-Type', 'Authorization', 'Authorisation'], // Specify the headers you want to allow
  //   // credentials: true, // S
  // });

  app.use(requestIp.mw());

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.use(new JsonParseMiddleware().use);

  app.useGlobalInterceptors(
    new UserActivityInterceptor(app.get(PrismaService)),
  );
  // app.useGlobalInterceptors(new TransactionInterceptor(app.get(PrismaService)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Maroon POC API')
    .setDescription('Maroon POC backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  Sentry.setupNestErrorHandler(app, new BaseExceptionFilter(httpAdapter));

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`\n\n
  --------------------------------------------------
    Server is listening http://localhost:${port}
  --------------------------------------------------
  \n`);
}
bootstrap();
