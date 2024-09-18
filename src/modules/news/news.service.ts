import { Injectable, Scope, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { firstValueFrom } from 'rxjs';
import { BaseService } from 'src/common/base.service';
import { PrismaService } from 'src/services/prisma.service';
import { PostQueryDto } from './dto/postRequest.dto';
import { PostResponseDto, ResultDto } from './dto/postResponse.dto';

@Injectable({ scope: Scope.REQUEST })
export class NewsService extends BaseService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) req: Request,
  ) {
    super(prismaService, req);
  }

  async getAllNews(query: PostQueryDto): Promise<PostResponseDto> {
    try {
      const { next, previous, limit } = query;
      const params: any = {
        auth_token: process.env.CRYPTOPANIC_API_KEY,
        public: true,
      };

      let url = '/v1/posts/';
      if (next) {
        url = next;
      } else if (previous) {
        url = previous;
      }

      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );
      const data = response.data;

      const limitNumber = limit ? parseInt(limit, 10) : undefined;
      let results = data.results;

      if (limitNumber && limitNumber > 0) {
        results = results.slice(0, limitNumber);
      }

      console.log(results);
      const staticImage =
        'https://assets.coingecko.com/articles/images/1819006/large/cryptocurrenciesusd_Large.jpg?1722573111';
      const mappedResults = results.map(
        (item: any) =>
          new ResultDto({
            kind: item.kind,
            domain: item.domain,
            source: item.source,
            title: item.title,
            published_at: item.published_at,
            slug: item.slug,
            currencies: item.currencies,
            id: item.id,
            url: item.url,
            created_at: item.created_at,
            description: item.title,
            image: staticImage,
          }),
      );

      return new PostResponseDto({
        count: data.count,
        next: data.next,
        previous: data.previous,
        results: mappedResults,
      });
    } catch (error) {
      throw new Error(`Error fetching news: ${error.message}`);
    }
  }
}
