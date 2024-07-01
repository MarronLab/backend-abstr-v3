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

async function bootstrap() {
  Sentry.init({
    environment:
      process.env.NODE_ENV === 'production' ? 'production' : 'development',
    dsn: process.env.SENTRY_DNS,
  });

  const app = await NestFactory.create(AppModule);

  app.use(requestIp.mw());

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.enableCors({
    origin: '*',
  });

  app.useGlobalInterceptors(new TransactionInterceptor(new PrismaService()));
  app.useGlobalInterceptors(
    new UserActivityInterceptor(app.get(PrismaService)),
  );
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

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`\n\n
  --------------------------------------------------
    Server is listening http://localhost:${port}
  --------------------------------------------------
  \n`);
}
bootstrap();
