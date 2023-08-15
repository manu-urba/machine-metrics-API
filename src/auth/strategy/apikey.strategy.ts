import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApikeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private readonly authService: AuthService) {
    super({ header: 'api-key', prefix: '' }, true, async (apyKey, done) => {
      if (this.authService.validateAPIKey(apyKey)) done(null, true);
      done(new UnauthorizedException(), null);
    });
  }
}
