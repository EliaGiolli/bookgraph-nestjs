import { 
    Controller, 
    Body, 
    Post,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service.js';
import { AuthRegisterDto } from './dto/auth-register.dto.js';
import { LoginDto } from './dto/auth-login.dto.js';
import { durationToMs } from '../common/utils/duration.util.js';

import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    // Keeps the cookie alive exactly as long as the JWT it carries, so a browser
    // client never holds a cookie whose token has already expired.
    private readonly tokenMaxAgeMs: number;

    // Marking the cookie Secure outside development; read through ConfigService
    // so every environment lookup in the Nest context goes through one place.
    private readonly isProduction: boolean;

    constructor(
        private readonly authService: AuthService,
        configService: ConfigService,
    ) {
        this.tokenMaxAgeMs = durationToMs(
            configService.getOrThrow<string>('JWT_EXPIRATION'),
        );
        this.isProduction = configService.get<string>('NODE_ENV') === 'production';
    }

    @Throttle({ default: { limit: 5, ttl: 6000 }})
    @Post('register')
    register(@Body() registerDto: AuthRegisterDto) {
        return this.authService.register(registerDto);
    }

    @Throttle({ default: { limit: 5, ttl: 6000 }})
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
        const result = await this.authService.signin(
            loginDto.username, 
            loginDto.password
        );

        response.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: this.isProduction,
            sameSite: 'lax',
            maxAge: this.tokenMaxAgeMs,
            path: '/',
        });

        return { message: 'Login effettuato' };
    }
}
