import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import type { AuthTokens } from './auth.service.js';
import { CurrentUser, Public } from './decorators/index.js';
import type { AuthenticatedUser } from './interfaces/index.js';
import {
    SignUpDto,
    SignInDto,
    SocialAuthDto,
    RefreshTokenDto,
    ForgotPasswordDto,
    ResetPasswordDto,
} from './dto/index.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('sign-up')
    @Public()
    @ApiOperation({ summary: 'Register with email and password' })
    signUp(@Body() dto: SignUpDto): Promise<AuthTokens> {
        return this.authService.signUp(dto);
    }

    @Post('sign-in')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in with email and password' })
    signIn(@Body() dto: SignInDto): Promise<AuthTokens> {
        return this.authService.signIn(dto);
    }

    @Post('social')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Exchange Clerk OAuth token for local JWT' })
    socialAuth(@Body() dto: SocialAuthDto): Promise<AuthTokens> {
        return this.authService.socialAuth(dto.token);
    }

    @Post('refresh')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    refresh(@Body() dto: RefreshTokenDto): Promise<{ accessToken: string }> {
        return this.authService.refreshAccessToken(dto.refreshToken);
    }

    @Post('forgot-password')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request a password reset code via email' })
    async forgotPassword(
        @Body() dto: ForgotPasswordDto,
    ): Promise<{ message: string }> {
        await this.authService.forgotPassword(dto.email);
        return { message: 'If the email exists, a reset code has been sent.' };
    }

    @Post('reset-password')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password using the emailed code' })
    async resetPassword(
        @Body() dto: ResetPasswordDto,
    ): Promise<{ message: string }> {
        await this.authService.resetPassword(dto.email, dto.code, dto.newPassword);
        return { message: 'Password has been reset successfully.' };
    }

    @Post('logout')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and revoke refresh token' })
    async logout(@Body() dto: RefreshTokenDto): Promise<{ message: string }> {
        await this.authService.logout(dto.refreshToken);
        return { message: 'Logged out successfully.' };
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get the current authenticated user' })
    getMe(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
        return user;
    }
}
