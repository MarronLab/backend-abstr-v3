import * as Sentry from '@sentry/node';
import {
  BaseExceptionFilter,
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserActivityInterceptor } from './common/user-activity.interceptor';
import { PrismaService } from './services/prisma.service';

async function bootstrap() {
  Sentry.init({
    environment:
      process.env.NODE_ENV === 'production' ? 'production' : 'development',
    dsn: process.env.SENTRY_DNS,
  });

  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.enableCors({
    origin: '*',
  });

  app.useGlobalInterceptors(
    new UserActivityInterceptor(app.get(PrismaService)),
  );

  const config = new DocumentBuilder()
    .setTitle('Maroon POC API')
    .setDescription('Maroon POC backend API')
    .setVersion('1.0')
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
