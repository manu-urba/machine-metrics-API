import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly envConfig: ConfigService) {}

  validateAPIKey(apiKey: string): boolean {
    const allowedApiKeys = this.envConfig
      .get<string>('ALLOWED_API_KEYS')
      .split(',');
    return allowedApiKeys.includes(apiKey);
  }
}
