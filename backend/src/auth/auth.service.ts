import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { SignInDto, SignUpDto } from './dto/index.js';

@Injectable()
export class AuthService {
    private static readonly SALT_ROUNDS = 10;

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async signUp(dto: SignUpDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(
            dto.password,
            AuthService.SALT_ROUNDS,
        );

        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
        });

        return this.generateTokens(user.id, user.email, user.role);
    }

    async signIn(dto: SignInDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(dto.password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokens(user.id, user.email, user.role);
    }

    private generateTokens(userId: string, email: string, role: string) {
        const payload = { sub: userId, email, role };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
