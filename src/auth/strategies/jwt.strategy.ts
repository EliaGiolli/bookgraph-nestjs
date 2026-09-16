import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service.js';

const cookieExtractor = (request: { cookies?: Record<string, string> }) =>
  // Read the JWT from the HttpOnly cookie when a browser client is used.
  request.cookies?.access_token ?? null;

// These claims are created by AuthService when the JWT is issued.
type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      // Accept both the application cookie and the standard Bearer header.
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      // The same environment secret must be used when signing and verifying tokens.
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
