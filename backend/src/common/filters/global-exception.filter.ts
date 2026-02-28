import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const requestUrl = httpAdapter.getRequestUrl(
      ctx.getRequest<import('express').Request>(),
    ) as string;

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: requestUrl,
      ...(typeof message === 'string'
        ? { message }
        : (message as Record<string, unknown>)),
    };

    if (status >= 500) {
      this.logger.error(
        `[${status}] ${httpAdapter.getRequestUrl(ctx.getRequest())}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
