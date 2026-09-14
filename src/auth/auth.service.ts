import { 
    Injectable, 
    UnauthorizedException,
    ConflictException 
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
    private readonly saltRounds = 10;

    // registers a new user with hashed password
    async register(registerDto: AuthRegisterDto) {
        const extinguishUser = await this.usersService.findOne(registerDto.username);
        if(extinguishUser){
            throw new ConflictException('Lo username esiste già');
        }
        const hashedPassword = await bcrypt.hash(
            registerDto.password, 
            this.saltRounds
        );

        const user = await this.usersService.create({
            name: registerDto.name,
            lastName: registerDto.lastName,
            username: registerDto.username,
            hashedPassword,
        });

        const { hashedPassword: _, ...safeUser } = user;
        return safeUser;
    }
    // Signs in with jwt
    async signin(username:string, password:string) {
        const user = await this.usersService.findOne(username);
        
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
