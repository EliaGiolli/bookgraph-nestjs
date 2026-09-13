import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service.js';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    // Signs in with jwt
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

    // Looks up the user identified by the verified JWT payload.
    async validateUser(payload: { sub: string }): Promise<any> {
        return await this.usersService.findOneById(payload.sub);
    }
}
