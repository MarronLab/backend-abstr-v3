import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/services/prisma.service';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.CRYPTOPANIC_BASE_URL,
    }),
  ],
  controllers: [NewsController],
  providers: [NewsService, PrismaService],
  exports: [NewsService],
})
export class NewsModule {}
