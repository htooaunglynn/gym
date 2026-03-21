import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '123456', description: '6-digit reset code' })
    @IsString()
    code!: string;

    @ApiProperty({ example: 'newStrongP@ss1' })
    @IsString()
    @MinLength(8)
    newPassword!: string;
}
