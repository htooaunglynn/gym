import { Module, RequestMethod } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      // Use the new path-to-regexp v8 named-wildcard syntax to avoid the
      // "Unsupported route path" warning emitted by NestJS's LegacyRouteConverter.
      forRoutes: [{ path: '/{*path}', method: RequestMethod.ALL }],
      pinoHttp: {
        // Attach a unique request ID to every log line
        genReqId: (req) => req.headers['x-request-id'] ?? crypto.randomUUID(),

        // Choose log level based on status code
        customLogLevel: (_req, res, err) => {
          if (err || (res.statusCode ?? 500) >= 500) return 'error';
          if ((res.statusCode ?? 0) >= 400) return 'warn';
          return 'info';
        },

        // Redact sensitive headers
        redact: ['req.headers.authorization', 'req.headers.cookie'],

        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
            singleLine: false,
          },
        },

        level: 'debug',
      },
    }),
  ],
})
export class LoggerModule {}
