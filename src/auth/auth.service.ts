import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service.js';
import { AuthRegisterDto } from './dto/auth-register.dto.js';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    // Registers a new user. Hashing and the duplicate-username check both live in
    // UsersService.create, so self-signup and the ADMIN route share one path.
    async register(registerDto: AuthRegisterDto) {
        return await this.usersService.create({
            name: registerDto.name,
            lastName: registerDto.lastName,
            username: registerDto.username,
            password: registerDto.password,
        });
    }
    // Signs in with jwt
    async signin(username:string, password:string) {
        // The hash is `select: false`, so the default lookup would return a user
        // whose hashedPassword is undefined and make every login fail.
        const user = await this.usersService.findByUsernameWithPassword(username);

        if(!user) {
            throw new UnauthorizedException('Credenziali non valide');
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            user.hashedPassword,
        )

        if(!passwordIsValid){
            throw new UnauthorizedException('Credenziali non valide');
        }

        const payload = { 
            sub: user.id, 
            username: user.username 
        }

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    // Looks up the user identified by the verified JWT payload.
    async validateUser(payload: { sub: string }): Promise<any> {
        return await this.usersService.findOneById(payload.sub);
    }
}
