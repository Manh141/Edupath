import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  JwtModule,
  type JwtModuleOptions,
  type JwtSignOptions,
} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bullmq';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './jwt-access.strategy';
import { SessionService } from './session.service';
import { TokenService } from './token.service';
import { OAuthService } from './oauth.service';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        const rawExpiresIn = configService.get('JWT_ACCESS_EXPIRES_IN');
        const expiresInString =
          typeof rawExpiresIn === 'string' && rawExpiresIn.trim().length > 0
            ? rawExpiresIn
            : undefined;

        const expiresIn = (expiresInString ??
          '15m') as JwtSignOptions['expiresIn'];

        const rawSecret = configService.get('JWT_ACCESS_SECRET');
        if (typeof rawSecret !== 'string' || rawSecret.length === 0) {
          throw new Error('JWT_ACCESS_SECRET must be defined');
        }
        const secret: string = rawSecret;

        const signOptions: JwtSignOptions = { expiresIn };

        const result = {
          secret,
          signOptions,
        };
        return result;
      },
    }),
    BullModule.registerQueueAsync({
      name: 'mail_queue',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: Number(configService.get<string>('REDIS_PORT') ?? 6379),
          password: configService.get<string>('REDIS_PASSWORD') || undefined,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    SessionService,
    JwtAccessStrategy,
    OAuthService,
    MailProcessor,
  ],
  exports: [AuthService],
})
export class AuthModule {}
