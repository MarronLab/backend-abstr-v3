import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as geoip from 'geoip-lite';
import * as acceptLanguageParser from 'accept-language-parser';

@Injectable({ scope: Scope.REQUEST })
export class UserSettingsService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getUserSettings() {
    const ip = this.request.clientIp || '127.0.0.1';
    const geo = geoip.lookup(ip);

    const timezone = geo?.timezone || 'UTC'; // Default to UTC if not found
    const currency = this.getCurrencyByCountry(geo?.country || 'US'); // Default to USD
    const language = this.getLanguageFromHeaders();

    return { timezone, currency, language };
  }

  private getCurrencyByCountry(country: string): string {
    const currencyMap: Record<string, string> = {
      US: 'USD',
      CA: 'CAD',
      GB: 'GBP',
    };

    return currencyMap[country] || 'USD';
  }

  private getLanguageFromHeaders(): string {
    const acceptLanguage = this.request.headers['accept-language'] || '';
    const languages = acceptLanguageParser.parse(acceptLanguage);
    return languages.length ? this.formatLanguage(languages[0]) : 'English';
  }

  private formatLanguage(language: acceptLanguageParser.Language): string {
    const languageMap: Record<string, string> = {
      en: 'English',
      fr: 'French',
    };

    const languageName = languageMap[language.code] || language.code;
    return language.region
      ? `${language.region.toUpperCase()} ${languageName}`
      : languageName;
  }
}
