import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/decorators/index.js';
import { AppService } from './app.service.js';

@ApiTags('Health')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Public()
    @Get('health')
    @ApiOperation({ summary: 'Health check' })
    getHealth() {
        return { status: 'ok' };
    }
}
