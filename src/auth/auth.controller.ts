import { 
    Controller, 
    Body, 
    Post,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service.js';
import { AuthRegisterDto } from './dto/auth-register.dto.js';
import { LoginDto } from './dto/auth-login.dto.js';

import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 1000,
            path: '/',
        });

        return { message: 'Login effettuato' };
    }
}
