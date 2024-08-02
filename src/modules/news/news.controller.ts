import {
  Controller,
  Get,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { PostResponseDto } from './dto/postResponse.dto';
import { PostQueryDto } from './dto/postRequest.dto';
import { postResponseSchema } from './news.schema';

import { ResponseValidationInterceptor } from 'src/common/response-validator.interceptor';
@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('post')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(postResponseSchema))
  @ApiCreatedResponse({
    description: 'List of news posts',
    type: PostResponseDto,
  })
  async getAllNews(@Query() query: PostQueryDto): Promise<PostResponseDto> {
    return this.newsService.getAllNews(query);
  }
}
