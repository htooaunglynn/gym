import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialAuthDto {
    @ApiProperty({ description: 'Clerk session token from OAuth callback' })
    @IsString()
    token!: string;
}
