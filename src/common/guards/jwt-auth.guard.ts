import { Injectable, Optional } from '@nestjs/common';
import { AuthGuard, AuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Nest does not copy @Optional() from AuthGuard onto this subclass.
  // Without this constructor, AuthModuleOptions is treated as required
  // and the app crashes in any module that forgot PassportModule.
  constructor(@Optional() options?: AuthModuleOptions) {
    super(options);
  }
}
