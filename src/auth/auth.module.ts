import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ApikeyStrategy } from './strategy/apikey.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [AuthService, ApikeyStrategy],
})
export class AuthModule {}
