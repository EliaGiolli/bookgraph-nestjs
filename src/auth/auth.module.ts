import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { UsersModule } from '../users/users.module.js';
import type { Duration } from '../common/utils/duration.util.js';

// register() is the module that actually provides AuthModuleOptions.
// JwtAuthGuard needs that token in every feature module that uses @UseGuards.
const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    passportModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          // The env schema already guarantees the "<number><unit>" shape.
          expiresIn: configService.getOrThrow<Duration>('JWT_EXPIRATION'),
        },
      }),
    }),
  ],
  exports: [AuthService, JwtModule, passportModule],
})
export class AuthModule {}
