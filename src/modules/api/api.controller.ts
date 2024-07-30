import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseValidationInterceptor } from '../../common/response-validator.interceptor';
import {
  GenerateApiKeyDto,
  GenerateApiKeyResponseDto,
} from './dto/generate-api-key.dto';
import { ApiService } from './api.service';
import { ListApiKeyResponseDto, ListApiKeysDto } from './dto/list-api-keys.dto';
import { DeleteApiKeyDto } from './dto/delete-api-key.dto';
import {
  generateApiKeyResponseSchema,
  listApiKeyResponseSchema,
} from './api.schema';

@ApiBearerAuth()
@ApiTags('apis')
@Controller('apis')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new ResponseValidationInterceptor(generateApiKeyResponseSchema),
  )
  @Post('/')
  @ApiOperation({ summary: 'Generate API key' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiCreatedResponse({
    description: 'The API key has been successfully generated.',
    type: GenerateApiKeyResponseDto,
  })
  async generateApiKey(@Body() generateApiKeyDto: GenerateApiKeyDto) {
    const response = await this.apiService.generateApiKey(generateApiKeyDto);

    return new GenerateApiKeyResponseDto({
      publicKey: response.publicKey,
      privateKey: response.privateKey,
    });
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new ResponseValidationInterceptor(listApiKeyResponseSchema))
  @Get('/')
  @ApiOperation({ summary: 'List API keys' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  @ApiCreatedResponse({
    description: 'The API keys has been successfully fetched.',
    type: [ListApiKeyResponseDto],
  })
  async listApiKeys(@Query('keyType') listApiKeysDto: ListApiKeysDto) {
    const response = await this.apiService.listApiKeys(listApiKeysDto);

    const result = response.map((row) => {
      return new ListApiKeyResponseDto({
        key: row.key,
        type: row.type,
        account: row.account,
        lastHit: row.lastHit,
        trustedIPs: row.trustedIPs,
        generatedOn: row.generatedOn,
      });
    });

    return result;
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:key')
  @ApiOperation({ summary: 'Delete API key' })
  @ApiOkResponse({
    description: 'The API key has been successfully removed.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' })
  @ApiInternalServerErrorResponse({ description: 'InternalServerError' })
  async deleteApiKey(@Param('key') deleteApiKeyDto: DeleteApiKeyDto) {
    await this.apiService.deleteApiKey(deleteApiKeyDto);
  }
}
