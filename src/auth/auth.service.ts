import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service.js';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signin(username:string, password:string) {
        const user = await this.usersService.findOne(username);
        if(user?.hashedPassword !== password) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.username }

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
