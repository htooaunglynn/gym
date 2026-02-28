import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
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
