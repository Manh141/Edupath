import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';
import { validateEnv } from './env.validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
      expandVariables: true,
    }),
  ],
  providers: [EnvService],
  exports: [ConfigModule, EnvService],
})
export class EnvModule {}
