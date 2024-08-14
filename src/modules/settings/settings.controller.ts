import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

import { SettingsService } from './settings.service';
import { GetSettingsResponseDto } from './dto/get-settings.dto';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('get-settings')
  @ApiCreatedResponse({
    description: 'List modulus settings',
    type: GetSettingsResponseDto,
  })
  async getApiSettings() {
    return await this.settingsService.getApiSettings();
  }
}
