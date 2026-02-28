import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { SignInDto, SignUpDto } from './dto/index.js';
import { CurrentUser, Public } from './decorators/index.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('sign-up')
    @ApiOperation({ summary: 'Register a new user' })
    signUp(@Body() dto: SignUpDto) {
        return this.authService.signUp(dto);
    }

    @Public()
    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in with email and password' })
    signIn(@Body() dto: SignInDto) {
        return this.authService.signIn(dto);
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get the current authenticated user' })
    getMe(@CurrentUser() user: { id: string; email: string; role: string }) {
        return user;
    }
}
